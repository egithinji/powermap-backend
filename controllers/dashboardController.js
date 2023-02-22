const Feature = require('../models/feature');
const { formatInTimeZone } = require('date-fns-tz');
const NUM_AREAS_PIE_CHART = 5;

exports.total_complaints_day = (req, res, next) => {
    Feature.find()
    .exec((err, features) => {
        if (err) {
            console.error("Error returning total complaints per day: "+err);
            return next(err);
        }
        const totalComplaintsPerDay = {}; 
        features.forEach(f => {
            const date = new Date(f.properties.posted_on);
            const formattedDate = formatInTimeZone(date, 'Africa/Nairobi', 'do MMM yyyy');
            totalComplaintsPerDay[formattedDate] = (totalComplaintsPerDay[formattedDate] || 0) + 1;
        });
        const result = [];
        for (const [key, value] of Object.entries(totalComplaintsPerDay)) {
            result.push({date: key, complaints: value});
        }
        return res.json(result);
    });
}

exports.total_complaints_area = (req, res, next) => {
    Feature.find()
    .exec((err, features) => {
        if (err) {
            console.error("Error returning total complaints per area: "+err);
            return next(err);
        }
        const totalComplaintsPerArea = {}; 
        features.forEach(f => {
            const area = f.properties.area;
            totalComplaintsPerArea[area] = (totalComplaintsPerArea[area] || 0) + 1;
        });
        const result = [];
        let index = 0;
        const array = Object.entries(totalComplaintsPerArea).sort((a,b) => (b[0]-a[0]));
        for (const [key, value] of array) {
            const color = getRandomColor();
            if (index < NUM_AREAS_PIE_CHART) {
                result.push({area: key, complaints: value, color});
            } else if (index === NUM_AREAS_PIE_CHART) {
                result.push({area: 'other', complaints: 1, color});
            } else {
                result[NUM_AREAS_PIE_CHART].complaints += 1;
            }
            index++;
        }
        return res.json(result);
    });
}

const getRandomColor = () => {
    const r1 = Math.floor(Math.random() * 256);
    const r2 = Math.floor(Math.random() * 256);
    const r3 = Math.floor(Math.random() * 256);

    return `rgb(${r1},${r2},${r3})`;
}