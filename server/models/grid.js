const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// (0,0) --> Top left
const gridSchema = new Schema({
  name: { type: String, required: true },
  xstart: { type: Number, required: true },
  xend: { type: Number, required: true },
  ystart: { type: Number, required: true },
  yend: { type: Number, required: true },
});

module.exports = mongoose.model('Grid', gridSchema);
