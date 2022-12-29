const Feature = require('../models/feature');
const Stats = require('../models/objects/stats');
const { format } = require('date-fns');

exports.today_features = (req, res, next) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    Feature.find({ "properties.posted_on":  { $gte: startOfToday, $lt: endOfToday } })
    .exec((err, features) => {
        features = features.map(f => {
            const date = new Date(f.properties.posted_on);
            return {
                type: f.type,
                geometry: f.geometry,
                properties: {
                    text: f.properties.text,
                    posted_on: format(date, 'do MMM yyyy, h:mm:ss a'),
                    area: f.properties.area
                }
            }
        })
        if (err) {
            console.log("Error retreiving features.");
            return  next(err);
        }
        const featureCollection = {
            type: 'FeatureCollection',
            features
        }
        return res.json(featureCollection);
    });
};

exports.today_stats = (req, res, next) => {
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
        const top3 = [];
        for (let i=0; i<3; i++) {
            if (i == topOutages.length) break;
            top3[i] = topOutages[i];
        }

        const stats = new Stats(top3, total);
        return res.json(stats);
    });
};