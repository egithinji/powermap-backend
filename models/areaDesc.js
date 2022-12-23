const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaDescSchema = new Schema({
    desc: { type: String, required: true },
    polygon: { type: Schema.Types.ObjectId, ref: "Polygon", required: true }
});

module.exports = mongoose.model("AreaDesc", AreaDescSchema);