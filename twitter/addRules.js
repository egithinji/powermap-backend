const axios = require("axios");
require('dotenv').config();

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
    console.log('adding rules');
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