const Feature = require('../models/feature');
const Stats = require('../models/objects/stats');
const Polygon = require('../models/polygon');
const { format } = require('date-fns');
const { formatInTimeZone } = require('date-fns-tz');
const fs = require('fs');
const pushNewPolygon = require('../pushNewPolygon');

exports.today_features = (req, res, next) => {
  // const today = new Date();
  // const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  // Modifying to display May 28th data after twitter api changed
  const specificDate = new Date('2023-05-28');
  const startOfDate = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate());
  const endOfDate = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate() + 1);

  Feature.find({ 'properties.posted_on': { $gte: startOfDate, $lt: endOfDate } }).exec((err, features) => {
    if (err) {
      console.log('Error retreiving features.');
      return next(err);
    }
    features = features.map((f) => {
      let date = new Date(f.properties.posted_on);
      //convert date to Kenyan time
      date = formatInTimeZone(date, 'Africa/Nairobi', 'do MMM yyyy, h:mm:ss a');
      return {
        type: f.type,
        geometry: f.geometry,
        properties: {
          text: f.properties.text,
          posted_on: date,
          area: f.properties.area,
        },
      };
    });

    const featureCollection = {
      type: 'FeatureCollection',
      features,
    };
    return res.json(featureCollection);
  });
};

exports.today_stats = (req, res, next) => {
  //   const today = new Date();
  //   const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  //   const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const specificDate = new Date('2023-05-28');
  const startOfDate = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate());
  const endOfDate = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate() + 1);

  Feature.find({ 'properties.posted_on': { $gte: startOfDate, $lt: endOfDate } }).exec((err, features) => {
    if (err) {
      console.log('Error retreiving features.');
      return next(err);
    }
    const top = {};
    let total = 0;
    for (const feature of features) {
      top[feature.properties.area] = (top[feature.properties.area] || 0) + 1;
      total += 1;
    }
    const topOutages = [];
    for (const area in top) {
      topOutages.push({ area, count: top[area] });
    }
    topOutages.sort((a, b) => b.count - a.count);
    const top3 = [];
    for (let i = 0; i < 3; i++) {
      if (i == topOutages.length) break;
      top3[i] = topOutages[i];
    }

    const stats = new Stats(top3, total);
    return res.json(stats);
  });
};

exports.area_list = (req, res, next) => {
  Polygon.find().exec((err, polygons) => {
    if (err) {
      console.log('Error retrieving polygons');
      return next(err);
    }

    const areaList = [];
    for (const polygon of polygons) {
      areaList.push(polygon.area);
    }
    const response = {
      areas: areaList,
    };
    return res.json(response);
  });
};

exports.add_polygon = (req, res, next) => {
  console.log(`Received new area data. Writing to file...`);
  const geojson = req.body.geojson;
  const data = JSON.stringify(req.body, null, 2);
  fs.writeFile('newPolygon.json', data, (err) => {
    if (err) {
      console.log('error writing new area to file');
      next(err);
    }
    console.log('New area data written to file.');
    pushNewPolygon();
  });
  return res.json({ success: true });
};
