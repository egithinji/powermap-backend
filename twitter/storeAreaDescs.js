const { getAreaDesc } = require('./getAreaDesc');
const fs = require('fs');
const readline = require('readline');
const Polygon = require('../models/polygon');
const AreaDesc = require('../models/areaDesc');
const { ObjectId } = require('mongodb');

var mongoose = require('mongoose');
const areaDesc = require('../models/areaDesc');
var mongoDB = 'mongodb+srv://library:ZEO5uzfoHOvpsE6n@cluster0.qkhblew.mongodb.net/powermap?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const readStream = fs.createReadStream('./location_descriptions.txt');
const rl = readline.createInterface({
    input: readStream
});

rl.on('line', line => {
    console.log(line);
    const areaDesc = getAreaDesc(line);
    Polygon.findOne({ 'area': areaDesc.polygonName })
        .exec((err, p) => {
            if (err) {
                return console.error(err);
            }
            if (p) {
                //console.log(`found polygon ${p.area} with coords ${p.coordinates}`);
                const ad = new AreaDesc ({
                    desc: areaDesc.areaDesc,
                    polygon: ObjectId(p._id)
                });
                ad.save(err => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(`saved area ${areaDesc.areaDesc}`)
                })
            }
        })
});

rl.on('close', () => {
    console.log('Finished reading file');
})



