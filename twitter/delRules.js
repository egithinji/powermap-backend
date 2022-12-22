const axios = require("axios");
require('dotenv').config();

console.log('deleting unwanted rules');
const rules = JSON.parse(process.env.DEL_RULES);
const ruleDeleter = {
    delete: {
        values: []
    }
}
rules.forEach(rule => {
    ruleDeleter.delete.values.push(rule); 
});

exports.delRules = function() {
    axios({
        method: 'post',
        url: 'https://api.twitter.com/2/tweets/search/stream/rules',
        headers: { Authorization: `Bearer `+process.env.TWITTER_BEARER_TOKEN},
        data: ruleDeleter
        })
    .catch(err => {
        console.error(err);
    });
}