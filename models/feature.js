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
    id: { type: Number, required: true },
});

module.exports = mongoose.model("Feature", FeatureSchema);