const https = require('https');
const AreaDesc = require('../models/areaDesc');
const Geometry = require('../models/objects/geometry');
const Properties = require('../models/objects/properties');
const Polygon = require('../models/polygon');
const Feature = require('../models/feature');
const { search_tweet, random_point } = require('../rust-modules/pkg');
require('dotenv').config();

(async () => {
    try {
        result = await AreaDesc.find({}).populate('polygon');
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
    } catch(err) {
        console.error(err);
    }
})();

const processTweet = (chunk, patterns, areaDescriptions) => {
        const tweet = JSON.parse(chunk);
        console.log('received tweet: '+tweet.data.text + ' id: '+tweet.data.id);
        const match = search_tweet(tweet.data.text.toLowerCase(), patterns);
        console.log(`match is: `, match);
        try {
            if (match < 0) return;
            console.log(`generating random point in ${patterns[match]}`);
            const coords = areaDescriptions[match].polygon.coordinates;
            const r = random_point(coords);
            console.log(`random point: ${r}`);
            console.log(`adding new feature to db`);
            const geometry = new Geometry('Point', r);
            const properties = new Properties(tweet.data.text, new Date(), patterns[match]);
            const details = {type: 'Feature', geometry, properties};
            const feature = new Feature(details);
            feature.save(err => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`New feature added to db`);
            });
        } catch(err) {
            console.error(err);
        }
};

const startServer = (areaDescriptions) => {
    let patterns = []; //area name patterns e.g. 'buru', 'buru buru'...
    for (const ad of areaDescriptions) {
        patterns.push(ad.desc);
    }
    let httpTimeToWait = 30000;
    let tcpTimeToWait = 0;
    let timeout = 30000;

    const options = {
        hostname: 'api.twitter.com',
        port: 443,
        path: '/2/tweets/search/stream',
        method: 'GET',
        headers: { 'Authorization': 'Bearer '+process.env.TWITTER_BEARER_TOKEN, 'Content-Type': 'application/json' },
    };

    function connectToStream() {
        req = https.get(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('number of sockets:', https.globalAgent.sockets[Object.keys(https.globalAgent.sockets)[0]].length);
            if (res.statusCode !== 200) {
                console.log(new Date() + "http level error: restart connection");
                setTimeout(() => {
                    req.destroy();
                    connectToStream(); //try removing this
                    httpTimeToWait = httpTimeToWait * 2;
                    return;
                }, httpTimeToWait);
                return;
            }

            httpTimeToWait = 30000;
            tcpTimeToWait = 0;

            let reqTimeout = setTimeout(() => {
                  console.log('No data received for 30 seconds. Closing connection.');
                  req.destroy();
                }, timeout);
            
            res.on('data', chunk => {
                console.log('number of sockets:', https.globalAgent.sockets[Object.keys(https.globalAgent.sockets)[0]].length);
                lastKeepAlive = new Date();
                try {
                    processTweet(chunk, patterns, areaDescriptions);
                } catch(err) {
                    console.log('*******Keep Alive*******');
                    console.log(new Date());
                }       
                clearTimeout(reqTimeout);
                reqTimeout = setTimeout(() => {
                  console.log('No data received for 30 seconds. Closing connection.');
                  req.destroy();
                }, timeout);
            });

            res.on('end', () => {
                console.log('response has ended.');
            })

            res.on('error', e => {
                if (e.code === 'ECONNRESET') {
                    console.log('tcp/ip level error: restart connection');
                    setTimeout(() => {
                        req.destroy();
                        connectToStream();
                        tcpTimeToWait += 250; 
                    }, tcpTimeToWait);
                } else {
                    console.error(e);
                }
            });
        });

        req.on('error', e => {
            console.log('system level error: restart connection');
            setTimeout(() => {
                req.destroy();
                connectToStream();
                tcpTimeToWait += 250; 
            }, tcpTimeToWait);
        });
    };
    connectToStream();
}

