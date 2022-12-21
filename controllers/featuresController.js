const Feature = require("../models/feature");

exports.today_features = (req, res, next) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    Feature.find({ "properties.posted_on":  { $gte: startOfToday, $lt: endOfToday } })
    .exec((err, features) => {
        if (err) {
            console.log("Error getting features.");
            return  next(err);
        }
        return res.json(features);
    });
};

exports.today_stats = (req, res) => {
    res.send("NOT IMPLEMENTED: today stats");
};