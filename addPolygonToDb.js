// Called by Github Action to add new polygon to database once PR is merged.
// Adds the new polygon (from the file newPolygon.json) to the database

const fs = require('fs');
require('dotenv').config();
const Polygon = require('./models/polygon');
const AreaDesc = require('./models/areaDesc');
const { ObjectId } = require('mongodb');

// Connect to db
var mongoose = require('mongoose');
var mongoDB = process.env.PROD_DB_URL;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let rawData = fs.readFileSync('newPolygon.json');
let data = JSON.parse(rawData);

// Add to polygon collection
const details = { 
                    area: data.areaName, 
                    coordinates: data.geojson.features[0].geometry.coordinates[0]
                };
const polygon = new Polygon(details);
polygon.save(function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Saved " + data.areaName);

    // Add area descriptions (should rename this to aliases) for this polygon
    Polygon.findOne({ 'area': data.areaName })
        .exec((err, p) => {
            if (err) {
                return console.error(err);
            }
            if (p) {
                const aliases = [];
                // The first alias should be the actual area name
                aliases.push(data.areaName);

                // Then add all the aliases provided by the user
                data.aliases.forEach(alias => aliases.push(alias));

                // Save each alias to the db
                aliases.forEach(alias => {
                    const ad = new AreaDesc ({
                        desc: alias,
                        polygon: ObjectId(p._id)
                    });
                    saveRecord(ad);
                });
                mongoose.connection.close();
            }
        })
});

const saveRecord = async (areaDescription) => {
    await areaDescription.save();
}

