const staticZones = require('./zones');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const iot = require('../mqtt/mqtt');

const JobObject = require('../models/job');
const MqttObject = require('../models/mqtt-message');

const measures = require('./measures');
const helper = require('./helper');

const assignmentEngine = require('../assignmentEngine/assignmentEngine');

let zones;

const initLifecycle = async () => {
  zones = await staticZones.getZones();
  console.log('Everything is up and running');
  // await assignmentEngine.init();
};

const toggleMqtt = (req, res, next) => {
  const status = req.body.mqttstatus;
  try {
    if (status === 'activate') {
      console.log('Activating')
      iot.runMqtt(triggerDbUpdate);
    } 
    if (status === 'shutdown') {
      console.log('Shutting down')
      iot.disconnectMqtt();
    }
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err, status: status });
  }
};

const toggleAE = async (req, res, next) => {
  const status = req.body.aestatus;
  try {
    if (status === 'activate') {
      console.log('Activating Assignment Engine');
      await assignmentEngine.init();
    }
    if (status === 'shutdown') {
      console.log('Shutting down assignment engine');
      assignmentEngine.shutdown();
    }
    res.json({ success: status })
  } catch (err) {
    res.json({ success: false, error: err, status: status})
  }
};

const triggerDbUpdate = async (message) => {
  const { tagId, timestamp, data } = message;

  const tagObject = await helper.findTag(tagId);

  await updateLocationAndZone(tagObject, data.coordinates);
  setTimeout(async () => {
    await jobHandler(tagObject);
  }, 500);

  try {
    logMessage(tagObject, message);
  } catch (err) {
    throw new HttpError('Logging the message failed', 422);
  }
};

const updateLocationAndZone = async (tagObject, coord) => {
  const distanceMoved = measures.euclideanDistance(tagObject.location, coord);
  // If the tag hasn't moved since last message, no update
  if (distanceMoved <= 50) {
    return;
  }
  const zone = helper.classifyZone(zones, coord);

  try {
    tagObject.location.x = coord.x;
    tagObject.location.y = coord.y;
    tagObject.zone = zone.name;
  } catch (err) {
    throw new HttpError('Fields for the tags could not be retrieved', 500);
  }

  try {
    await tagObject.save();
  } catch (err) {
    throw new HttpError(
      'Could not update the tag location, something went wrong',
      500
    );
  }
};

const jobHandler = async (tagObject) => {
  console.log('message arrived');

  if (tagObject.type === 'so') {
    return;
  }

  // Retrieve job that's not completed

  let jobObject;
  try {
    jobObject = await JobObject.find({
      status: 'assigned',
      mhm: tagObject._id,
      workstatus: { $ne: 'completed' },
    });
  } catch (err) {
    throw new HttpError('Could not find a Job, something went wrong', 500);
  }
  if (jobObject.length === 0) {
    return;
  }
  if (jobObject.length === 1) {
    jobObject = jobObject[0];
  }

  // We now have a MHM and an assigned Job for it
  let distance;
  let changed = false;

  if (jobObject.workstatus === 'delivering') {
    distance = measures.euclideanDistance(
      jobObject.destination,
      tagObject.location
    );
    if (distance <= 500) {
      jobObject.workstatus = 'completed';
      tagObject.workstatus = 'idle';
      tagObject.status = 'unassigned';
      changed = true;
    }
  }

  if (jobObject.workstatus === 'pick-up') {
    distance = measures.euclideanDistance(jobObject.from, tagObject.location);
    console.log('pick-up', distance);
    if (distance <= 500) {
      jobObject.workstatus = 'delivering';
      tagObject.workstatus = 'delivering';
      changed = true;
    }
  }

  if (changed) {
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await jobObject.save({ session: session });
      await tagObject.save({ session: session });
      await session.commitTransaction();
    } catch (err) {
      throw new HttpError(
        'Failed to update the job statuses for the MHM or the Job',
        500
      );
    }
  }
};

const logMessage = (tagObject, message) => {
  const { tagId, timestamp, data } = message;
  const dbId = tagObject._id;
  const type = tagObject.type;

  let time = helper.timestampToDateTime(timestamp);
  let createdMqttMessage;
  try {
    createdMqttMessage = new MqttObject({
      tagid: tagId,
      dbid: dbId,
      type,
      timestamp: time,
      coordinates: {
        x: data.coordinates.x,
        y: data.coordinates.y,
      },
    });
  } catch (err) {
    throw new HttpError('Could not create the mqtt message for logging', 500);
  }

  try {
    createdMqttMessage.save();
  } catch (err) {
    throw new HttpError(
      'The mqtt message could not be save for some reason',
      422
    );
  }
};

exports.initLifecycle = initLifecycle;
exports.toggleMqtt = toggleMqtt;
exports.toggleAE = toggleAE;
