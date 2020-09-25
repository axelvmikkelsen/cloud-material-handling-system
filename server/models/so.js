const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soSchema = new Schema({
  name: { type: String, required: true },
  byname: { type: String, required: true },
  type: { type: String },
  transportclass: {
    agv: { type: Boolean, required: true },
    forklift: { type: Boolean, required: true },
    manual: { type: Boolean, required: true },
  },
  location: {
    x: { type: Number },
    y: { type: Number },
  },
  lastseen: { type: Number },
  area: { type: String },
  description: { type: String, required: true },
});

module.exports = mongoose.model('SO', soSchema);
