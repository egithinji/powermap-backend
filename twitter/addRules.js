const axios = require("axios");
require('dotenv').config();

console.log('adding rules');
const rules = JSON.parse(process.env.RULES);
const ruleAdder = {
    add: []
}
rules.forEach(rule => {
    const entry = {
        value: rule
    };
    ruleAdder.add.push(entry); 
});

exports.addRules = function() {
    axios({
        method: 'post',
        url: 'https://api.twitter.com/2/tweets/search/stream/rules',
        headers: { Authorization: `Bearer `+process.env.TWITTER_BEARER_TOKEN},
        data: ruleAdder
        })
    .catch(err => {
        console.error(err);
    });
}