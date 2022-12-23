const { getPolygon } = require('./getPolygon'); 
const fs = require('fs');
const Polygon = require('../models/polygon');

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://library:ZEO5uzfoHOvpsE6n@cluster0.qkhblew.mongodb.net/powermap?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

fs.readdir('./polygons',(err, files) => {
    if (err) {
        console.error(err);
    }
    for (const file of files) {
        const p = getPolygon('./polygons/'+file);
        polygonCreate(p.area, p.coordinates); 
    }
});

function polygonCreate(area, coordinates) {
    const details = { area, coordinates }
    const polygon = new Polygon(details);
    polygon.save(function (err) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Saved " + area);
    });
}
