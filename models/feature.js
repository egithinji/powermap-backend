const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeatureSchema = new Schema({
    type: { type: String, required: true },
    geometry: {
       type: Object,
    },
    properties: {
       type: Object, 
    },
});

module.exports = mongoose.model("Feature", FeatureSchema);