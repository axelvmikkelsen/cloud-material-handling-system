const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// (0,0) --> Top left
const areaSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  xstart: { type: Number, required: true },
  xend: { type: Number, required: true },
  ystart: { type: Number, required: true },
  yend: { type: Number, required: true },
  grid: { type: mongoose.Types.ObjectId, required: true, ref: 'Grid' },
});

module.exports = mongoose.model('Area', areaSchema);
