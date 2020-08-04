const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// (0,0) --> Top left
const mapSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true},
  grid: { type: mongoose.Types.ObjectId, required: true },
  zones: [
     { type: mongoose.Types.ObjectId }
  ]
});

module.exports = mongoose.model('Map', mapSchema);