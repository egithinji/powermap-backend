const https = require('https');
const { addRules } = require('./addRules');
const { delRules } = require('./delRules');
require('dotenv').config();

let lastKeepAlive = new Date();
let httpTimeToWait = 60000;
let tcpTimeToWait = 0;

addRules();
delRules();

const options = {
    hostname: 'api.twitter.com',
    port: 443,
    path: '/2/tweets/search/stream',
    method: 'GET',
    headers: { 'Authorization': 'Bearer '+process.env.TWITTER_BEARER_TOKEN, 'Content-Type': 'application/json' },
};

setInterval(() => {
    let now = new Date();
    let elapsed = Math.abs((now.getTime() - lastKeepAlive.getTime())/1000) ;
    if (elapsed > 30) {
        console.log('keep alive time elapsed: destroying connection')
        // destroying the connection will triggers an 'error' event
        // either  on the response object or on the request object
        https.globalAgent.destroy();
    }
}, 30000);

(function connectToStream() {
    req = https.get(options, (res) => {
        console.log('statusCode:', res.statusCode);
        if (res.statusCode !== 200) {
            console.log(new Date() + "http level error: restart connection");
            setTimeout(() => {
                connectToStream();
                httpTimeToWait = httpTimeToWait * 2;
            }, httpTimeToWait);
            return;
        }
        
        res.on('data', chunk => {
            console.log('received data....');
            lastKeepAlive = new Date();
            try {
                print(chunk);
            } catch(err) {
                console.log('*******Keep Alive*******');
                console.log(new Date());
            }       
        });

        res.on('error', e => {
            if (e.code === 'ECONNRESET') {
                console.log('tcp/ip level error: restart connection');
                setTimeout(() => {
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
            connectToStream();
            tcpTimeToWait += 250; 
        }, tcpTimeToWait);
    });
})();

const print = (chunk) => {
    const tweet = JSON.parse(chunk);
    console.log(tweet);
    console.log(tweet.data.text + ' id: '+tweet.data.id);
};