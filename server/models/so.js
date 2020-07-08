const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soSchema = new Schema({
  name: { type: String, required: true},
  type: { type: String, required: true },
  transportclass: {
    agv: { type: Boolean, required: true },
    forklift: { type: Boolean, required: true },
    manual: { type: Boolean, required: true },
  },
  location: {
    x: { type: Number },
    y: { type: Number },
  },
  lastseen: { type: Date },
  zone: { type: String },
  description: { type: String, required: true },
});

module.exports = mongoose.model('SO', soSchema);
