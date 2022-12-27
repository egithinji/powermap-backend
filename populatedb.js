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
var Geometry = require('./models/objects/geometry')
var Properties = require('./models/objects/properties')
var Feature = require('./models/feature')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var geometriesArray = []
var propertiesArray = []
var featuresArray = []

function geometryCreate(type, coordinates, cb) {
    const geometry = new Geometry(type, coordinates);
    geometriesArray.push(geometry);
}

function propertiesCreate(text, posted_on, area, cb) {
    const properties = new Properties(text, posted_on, area);
    propertiesArray.push(properties);
}

function featureCreate(type, geometry, properties, cb) {
    const details = {type, geometry, properties};
    const feature = new Feature(details);
    feature.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log("New feature: " + feature);
        featuresArray.push(feature);
        cb(null, feature);
    });
}

function createGeometry() {
    geometryCreate("Point", [36.803308044956964,-1.3157084411735558]);
}

function createProperties() {
   propertiesCreate("This is a test tweet.", new Date(), "somewhere"); 
}

function createFeature(cb) {
    featureCreate("Feature", geometriesArray[0], propertiesArray[0], cb);
}

createGeometry();
createProperties();

async.series([
    createFeature,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('GEOMETRYInstances: '+geometriesArray);
        console.log('PROPERTIESInstances: '+propertiesArray);
        console.log('FEATURESInstances: '+featuresArray);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
