const Feature = require('../models/feature');
const Stats = require('../models/objects/stats');

exports.today_features = (req, res, next) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    Feature.find({ "properties.posted_on":  { $gte: startOfToday, $lt: endOfToday } })
    .exec((err, features) => {
        if (err) {
            console.log("Error retreiving features.");
            return  next(err);
        }
        return res.json(features);
    });
};

exports.today_stats = (req, res) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    Feature.find({ "properties.posted_on":  { $gte: startOfToday, $lt: endOfToday } })
    .exec((err, features) => {
        if (err) {
            console.log("Error retreiving features.");
            return  next(err);
        }
        const top = {};
        let total = 0;
        for (const feature of features) {
            top[feature.properties.area] = (top[feature.properties.area] || 0) + 1;
            total += 1;
        }
        const topOutages = [];
        for (const area in top) {
            topOutages.push({area, count: top[area]});
        }
        topOutages.sort((a,b) => b.count - a.count);
        const top3 = [topOutages[0], topOutages[1], topOutages[2]];

        const stats = new Stats(top3, total);
        return res.json(stats);
    });
};