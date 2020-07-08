const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const helper = require('../lifecycle/helper');


const jobSchema = new Schema({
  description: { type: String, required: true },
  status: { type: String, required: true, enum: ['unassigned', 'assigned'] },
	workstatus: { type: String, enum: ['', 'pick-up', 'delivering', 'completed']},
  from: {
    x: { type: Number, reqiured: true },
    y: { type: Number, reqiured: true },
  },
  destination: {
    x: { type: Number, reqiured: true },
    y: { type: Number, reqiured: true },
  },
  ect: { type: Number },
  duration: { type: Number },
  timecreated: { type: Number, required: true, default: Date.now },
  timeassigned: { type: Number },
  timecompleted: { type: Number },
  so: { type: mongoose.Types.ObjectId, required: true, ref: 'SO' },
  mhm: { type: mongoose.Types.ObjectId, ref: 'MHM' },
});

module.exports = mongoose.model('Job', jobSchema);
