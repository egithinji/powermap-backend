const https = require('https');
const AreaDesc = require('../models/areaDesc');
const Geometry = require('../models/objects/geometry');
const Properties = require('../models/objects/properties');
const Polygon = require('../models/polygon');
const Feature = require('../models/feature');
const { search_tweet, random_point } = require('../rust-modules/pkg');
require('dotenv').config();
const EventEmitter = require('events');
const emitter = new EventEmitter();
const debug = require("debug")("twitterServer");

(async () => {
    result = AreaDesc.find({}).populate('polygon')
    .exec((err, result) => {
        if (err){
            debug(`error retreiving area descriptions: ${err}`);
        }
        const areaDescriptions = result.map(entry => {
            const coords = [];
            for (const coord of entry.polygon.coordinates) {
                const c1 = coord[0].toString();
                const c2 = coord[1].toString();
                coords.push([Number(c1),Number(c2)]);
            }
            return {
                desc: entry.desc,
                polygon: {
                    area: entry.polygon.area,
                    coordinates: coords
                }
            }
        });
        startServer(areaDescriptions);
    });
})();

const processTweet = (chunk, patterns, areaDescriptions) => {
        const tweet = JSON.parse(chunk);
        debug(`received tweet: ${tweet.data.text} id: ${tweet.data.id}`);
        const match = search_tweet(tweet.data.text.toLowerCase(), patterns);
        debug(`match is: ${match}`);
        try {
            if (match < 0) return;
            debug(`generating random point in ${patterns[match]}`);
            const coords = areaDescriptions[match].polygon.coordinates;
            const r = random_point(coords);
            debug(`random point: ${r}`);
            debug(`adding new feature to db`);
            const geometry = new Geometry('Point', r);
            const properties = new Properties(tweet.data.text, new Date(), patterns[match]);
            const details = {type: 'Feature', geometry, properties};
            const feature = new Feature(details);
            feature.save(err => {
                if (err) {
                    debug(`error saving feature in db: ${err}`);
                    return;
                }
                debug(`New feature added to db. Notify clients.`);
                emitter.emit('new-feature'); 
            });
        } catch(err) {
            debug(`error processing tweet: ${err}`);
        }
};

const startServer = (areaDescriptions) => {
    let patterns = []; //area name patterns e.g. 'buru', 'buru buru'...
    for (const ad of areaDescriptions) {
        patterns.push(ad.desc);
    }
    let httpTimeToWait = 30000;
    let tcpTimeToWait = 0;
    let timeout = 240000;

    const options = {
        hostname: 'api.twitter.com',
        port: 443,
        path: '/2/tweets/search/stream',
        method: 'GET',
        headers: { 'Authorization': 'Bearer '+process.env.TWITTER_BEARER_TOKEN, 'Content-Type': 'application/json', 'Connection': 'Keep-Alive'},
    };

    function connectToStream() {
        stream = https.get(options, (res) => {
            emitter.emit('server-running');
            debug(`statusCode: ${res.statusCode} next reset: ${res.headers['x-rate-limit-reset']}`);
            debug(`number of sockets: ${https.globalAgent.sockets[Object.keys(https.globalAgent.sockets)[0]].length}`);
            if (res.statusCode !== 200) {
                debug(`${new Date()} http level error: restart connection`);
                setTimeout(() => {
                    stream.destroy();
                    connectToStream();
                    httpTimeToWait = httpTimeToWait * 2;
                    return;
                }, httpTimeToWait);
                return;
            }

            httpTimeToWait = 30000;
            tcpTimeToWait = 0;

            let reqTimeout = setTimeout(() => {
                  debug(`No data received for 240 seconds. Closing connection.`);
                  stream.destroy();
                }, timeout);
            
            res.on('data', chunk => {
                debug(`number of sockets: ${https.globalAgent.sockets[Object.keys(https.globalAgent.sockets)[0]].length}`);
                try {
                    processTweet(chunk, patterns, areaDescriptions);
                } catch(err) {
                    debug(`*******Keep Alive*******`);
                    debug(`${new Date()}`);
                }       
                clearTimeout(reqTimeout);
                reqTimeout = setTimeout(() => {
                  debug(`No data received for 240 seconds. Closing connection.`);
                  stream.destroy();
                }, timeout);
            });

            res.on('end', () => {
                debug(`response has ended.`);
            })

            res.on('error', e => {
                if (e.code === 'ECONNRESET') {
                    debug(`tcp/ip level error: restart connection`);
                    setTimeout(() => {
                        stream.destroy();
                        connectToStream();
                        tcpTimeToWait += 250; 
                    }, tcpTimeToWait);
                } else {
                    debug(`error: ${e}`);
                }
            });
        });

        stream.on('error', e => {
            debug(`system level error: restart connection`);
            setTimeout(() => {
                stream.destroy();
                connectToStream();
                tcpTimeToWait += 250; 
            }, tcpTimeToWait);
        });
    };
    connectToStream();
}

module.exports = emitter;