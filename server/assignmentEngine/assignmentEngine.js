const JobObject = require('../models/job');
const MHMObject = require('../models/mhm');

const mongoose = require('mongoose');
const HttpError = require('../models/http-error');

const measures = require('../lifecycle/measures');

// Temporary solution, look into Bull.js and Docker
let jobStack;
let assignInterval;

const init = async () => {
  jobStack = await findAllUnassigned();
  assignInterval = setInterval(() => assignJobs(jobStack), 10000);
};

const shutdown = () => {
  clearInterval(assignInterval);
};

const findAllUnassigned = async () => {
  return await JobObject.find({ status: 'unassigned' })
    .sort({ createdtime: 1 })
    .exec();
};

const assignJobs = async (jobStack) => {
  const checkJobs = await findAllUnassigned();
  if (checkJobs !== jobStack) {
    jobStack = checkJobs;
  }
  for (let i = 0; i < jobStack.length; i++) {
    await findCandidate(jobStack[i]);
  }
};

const findCandidate = async (job) => {
  // First a job cannot be assigned when a job is currently active.
  const soId = job.so;
  let occupiedJobs;
  try {
    occupiedJobs = await JobObject.find({
      status: 'assigned',
      workstatus: { $ne: 'completed' },
      so: soId,
    });
  } catch (err) {
    throw new HttpError(
      'Something went wrong when trying to find other assigned jobs for the SO',
      500
    );
  }

  // If the SO is currently active in a job, we return
  if (occupiedJobs._id) {
    console.log('So is occupied');
    return;
  }

  let mhms;
  try {
    mhms = await MHMObject.find({ status: 'available' });
  } catch (err) {
    throw new HttpError(
      'Could not retrieve available MHMs, something went wrong',
      500
    );
  }
  if (mhms.length === 0) {
    return;
  }

  // Lower score the better
  let bestCandidate = {
    mhmid: '',
    score: Number.POSITIVE_INFINITY,
  };

  for (var i = 0; i < mhms.length; i++) {
    mhms[i].score = calculateScore(mhms[i], job);
    if (mhms[i].score < bestCandidate.score) {
      bestCandidate.mhmid = mhms[i]._id;
      bestCandidate.score = mhms[i].score;
    }
  }

  if (bestCandidate.mhmid === '') {
    return;
  }

  let mhm;
  try {
    mhm = await MHMObject.findById(bestCandidate.mhmid);
  } catch (err) {
    throw new HttpError('Could not find the best mhm candidate');
  }

  try {
    job.mhm = bestCandidate.mhmid;
    job.status = 'assigned';
    job.workstatus = 'pick-up';
    job.timeassigned = Date.now();
    mhm.status = 'occupied';
    mhm.workstatus = 'pick-up';
  } catch (err) {
    throw new HttpError('Fields could not be updated', 500);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await job.save({ session: session });
    await mhm.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    throw new HttpError(
      'Could not save after assigning job, something went wrong',
      422
    );
  }
};

const calculateScore = (mhm, job) => {
  return measures.euclideanDistance(mhm.location, job.from);
};

exports.init = init;
exports.shutdown = shutdown;
