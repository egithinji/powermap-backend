#! /usr/bin/env node

console.log('This script populates some test documents to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Polygon = require('./models/polygon');
const { getPolygon } =  require('./twitter/getPolygon');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


function polygonCreate(area, coordinates) {
    const details = { area, coordinates }
    const polygon = new Polygon(details);
    polygon.save(function (err) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("New polygon added to db: " + polygon);
    });
}

let p = getPolygon('./twitter/polygons/87_kinoo.txt');
console.log(p.area);
polygonCreate(p.area, p.coordinates);

// All done, disconnect from database
//mongoose.connection.close();
