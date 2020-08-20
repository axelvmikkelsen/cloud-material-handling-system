const staticAreas = require('./areas');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const iot = require('../mqtt/mqtt');

const JobObject = require('../models/job');
const MqttObject = require('../models/mqtt-message');

const measures = require('./measures');
const helper = require('./helper');

const assignmentEngine = require('../assignmentEngine/assignmentEngine');

let areas;

const initLifecycle = async () => {
  areas = await staticAreas.getAreas();
};

const toggleMqtt = (req, res, next) => {
  const status = req.body.mqttstatus;
  try {
    if (status === 'activate') {
      iot.runMqtt(triggerDbUpdate);
    } 
    if (status === 'shutdown') {
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
      await assignmentEngine.init();
    }
    if (status === 'shutdown') {
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
  if (!tagObject) {
    throw new HttpError('The tag object from MQTT does not match any database entry', 422);
  }
  
  await updateLocationAndArea(tagObject, data.coordinates, timestamp-(2*60*60)).then(async () => {
    await jobHandler(tagObject);
  })

  try {
    logMessage(tagObject, message);
  } catch (err) {
    throw new HttpError('Logging the message failed', 422);
  }
};

const updateLocationAndArea = async (tagObject, coord, timestamp) => {
  let distanceMoved;
  try {
    distanceMoved = measures.euclideanDistance(tagObject.location, coord);
  } catch (err) {
    throw new HttpError('The error occured because a field couldnt be accessed, there is a database mismatch', 422);
  }
  // If the tag hasn't moved since last message, no update
  // if (distanceMoved <= 50) {
  //   return;
  // }
  let area = helper.classifyArea(areas, coord);
  if (!area) {
    area = {name: 'NaN'}
  }

  try {
    tagObject.location.x = coord.x;
    tagObject.location.y = coord.y;
    tagObject.area = area.name;
    tagObject.lastseen = Math.round(timestamp)
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
  /*
    Applies to MHMs, the function updates the job and mhm status depending on criteria.
  */

  if (tagObject.type === 'so') {
    return;
  }

  // Retrieve assigned jobs that hasn't been completed for the tagObject

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

  // If no jobs are found we return
  if (jobObject.length === 0) {
    return;
  }

  // If the job is found the single array element is extracted
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
      jobObject.timecompleted = Date.now();
      tagObject.workstatus = 'idle';
      tagObject.status = 'unassigned';
      changed = true;
    }
  }

  if (jobObject.workstatus === 'pick-up') {
    distance = measures.euclideanDistance(jobObject.from, tagObject.location);
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

const getServerStatus = async (req, res, next) => {
  let state;
  try {
    state = mongoose.connection.readyState;
  } catch (err) {
    throw new HttpError('Something went wrong when getting server status', 500);
  }
  res.status(200).json({ success: true, state })
}

const getMqttStatus = async (req, res, next) => {
  let state;
}

exports.initLifecycle = initLifecycle;
exports.toggleMqtt = toggleMqtt;
exports.toggleAE = toggleAE;
exports.getServerStatus = getServerStatus;
