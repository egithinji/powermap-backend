const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolygonSchema = new Schema({
    area: { type: String, required: true },
    coordinates: [[mongoose.Types.Decimal128]]
});

module.exports = mongoose.model("Polygon", PolygonSchema);