const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mqttMessageSchema = new Schema({
  tagid: { type: String, reqiured: true },
  dbid: { type: mongoose.Types.ObjectId, required: true },
  type: { type: String, enum: ['so', 'mhm']},
  timestamp: { type: Date, required: true },
  coordinates: {
     x: { type: Number, required: true },
     y: { type: Number, required: true }
  }
});

module.exports = mongoose.model('MQTT', mqttMessageSchema);