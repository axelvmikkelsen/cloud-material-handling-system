const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mhmSchema = new Schema({
  name: { type: String, reqiured: true },
  byname: { type: String, required: true },
  type: { type: String, default: 'mhm' },
  status: { type: String, required: true, enum: ['available', 'occupied'] },
  workstatus: { type: String, enum: ['pick-up', 'delivering', 'idle'] },
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

module.exports = mongoose.model('MHM', mhmSchema);
