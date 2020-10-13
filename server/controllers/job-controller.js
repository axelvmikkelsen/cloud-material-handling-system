const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const SmartObject = require('../models/so');
const MHMObject = require('../models/mhm');
const JobObject = require('../models/job');
const AreaObject = require('../models/area');
const job = require('../models/job');

const createJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        'Invalid inputs passed when creating a Job, please check your input',
        422
      )
    );
  }

  const { description, fromarea, toarea, soid } = req.body;

  if (fromarea === toarea) {
    return next(
      new HttpError(
        'Start and destination area are the same, invalid input',
        422
      )
    );
  }

  // Finding the Area Objects
  let fromArea, toArea;
  try {
    fromArea = await AreaObject.findById(fromarea);
    toArea = await AreaObject.findById(toarea);
  } catch (err) {
    return next(
      new HttpError(
        'The areas are somehow invalid, could not be retreieved by ID',
        422
      )
    );
  }

  // Find area coordinates to classify distance
  let fromCoord, toCoord;
  try {
    fromCoord = {
      x: (fromArea.xend - fromArea.xstart)/2 + fromArea.xstart,
      y: (fromArea.yend - fromArea.ystart)/2 + fromArea.ystart,
    };
    toCoord = {
      x: (toArea.xend - toArea.xstart)/2 + toArea.xstart,
      y: (toArea.yend - toArea.ystart)/2 + toArea.ystart,
    };
  } catch (err) {
    return next(new HttpError('Assigning coordinates to areas failed', 500));
  }

  let smartObject;
  try {
    smartObject = await SmartObject.findById(soid);
  } catch (err) {
    return next(new HttpError('Creating job failed, please try again', 500));
  }

  if (!smartObject) {
    return next(
      new HttpError('Could not find the specified Smart Object', 404)
    );
  }

  let createdJob;
  try {
    createdJob = new JobObject({
      description,
      status: 'unassigned',
      workstatus: '',
      fromarea,
      toarea,
      from: fromCoord,
      destination: toCoord,
      ect: 0,
      duration: 0,
      so: smartObject,
      mhm: null,
    });
  } catch (err) {
    return next(new HttpError('Job creation failed, an error occured', 500));
  }

  try {
    await createdJob.save();
  } catch (err) {
    res.status(500).json({ success: false });
    return next(new HttpError('Saving the Job failed, please try again', 500));
  }

  res.status(201).json({ success: true });
};

const getJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await JobObject.find({});
  } catch (err) {
    return next(new HttpError('Could not retrieve Jobs', 500));
  }

  try {
    res.json({
      jobs: jobs.map((job) => job.toObject({ getters: true })),
    });
  } catch (err) {
    return next(new HttpError('No jobs found', 500));
  }
};

const getJobById = async (req, res, next) => {
  const jobId = req.params.job_id;
  let jobObject;
  try {
    jobObject = await JobObject.findById(jobId);
  } catch (err) {
    return next(
      new HttpError('Somehting went wrong, could not find a Job', 500)
    );
  }
  if (!jobObject) {
    return next(
      new HttpError('Could not find a Job with the provided id', 404)
    );
  }
  res.json({ jobobject: jobObject.toObject({ getters: true }) });
};

const assignJob = async (req, res, next) => {
  const { jobid, mhmid } = req.body;
  let job;
  try {
    job = await JobObject.findById(jobid);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not find the job', 500)
    );
  }
  if (!job) {
    return next(
      new HttpError('Could not find the Job for the specified id', 404)
    );
  }

  let mhm;
  try {
    mhm = await MHMObject.findById(mhmid);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not find the MHM', 500)
    );
  }
  if (!mhm) {
    return next(
      new HttpError('Could not find the MHM for the specified id', 404)
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    job.status = 'assigned';
    job.workstatus = 'pick-up';
    job.mhm = mhm;
    await job.save({ session: session });
    mhm.status = 'assigned';
    mhm.workstatus = 'pick-up';
    await mhm.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError('Assigning job failed, please try again', 500));
  }

  res.status(200).json({ job: job.toObject({ getters: true }) });
};

const getScheduledJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await JobObject.find({
      status: 'assigned',
      workstatus: { $ne: 'completed' },
    });
  } catch (err) {
    return next(new HttpError('Could not retrieve Jobs', 500));
  }

  
  try {
    let editJobs = await editJobStructure(jobs);
    res.json({
      jobs: editJobs,
    });
  } catch (err) {
    return next(new HttpError('No jobs found', 500));
  }
};

const getUnscheduledJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await JobObject.find({ status: 'unassigned' });
  } catch (err) {
    return next(new HttpError('Could not retrieve Jobs', 500));
  }

  try {
    let editJobs = await editJobStructure(jobs);
    res.json({
      jobs: editJobs,
    });
  } catch (err) {
    return next(new HttpError('No jobs found', 500));
  }
};

const getCompletedJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await JobObject.find({ workstatus: 'completed' });
  } catch (err) {
    return next(new HttpError('Could not retrieve Jobs', 500));
  }

  try {
    let editJobs = await editJobStructure(jobs);
    res.json({
      jobs: editJobs,
    });
  } catch (err) {
    return next(new HttpError('No jobs found', 500));
  }
};

const editJobStructure = async (jobs) => {
  let fromAreaName, toAreaName, soName, mhmName;
  let newJobs = [];
  for (i = 0; i < jobs.length; i++) {
    const oldJob = jobs[i];
    fromAreaName = await getFromArea(oldJob.fromarea);
    toAreaName = await getToArea(oldJob.toarea);
    soName = await getSOName(oldJob.so);
    mhmName = await getMHMName(oldJob.mhm);
    let newJob = {
      _id: oldJob._id,
      status: oldJob.status,
      workstatus: oldJob.workstatus,
      fromarea: fromAreaName,
      toarea: toAreaName,
      so: soName,
      mhm: mhmName,
      timecreated: oldJob.timecreated,
    }
    newJobs.push(newJob);
  }
  return newJobs;
}

const getFromArea = async (fromId) => {
  let fromArea;
  try {
    fromArea = await AreaObject.findById(fromId);
  } catch (err) {

  }
  return fromArea.name;
}

const getToArea = async (toId) => {
  let toArea;
  try {
    toArea = await AreaObject.findById(toId);
  } catch (err) {

  }
  return toArea.name;
}

const getSOName = async (soId) => {
  let so;
  try {
    so = await SmartObject.findById(soId);
  } catch (err) {

  }
  return so.byname;
}

const getMHMName = async (mhmId) => {
  let mhm;
  try {
    mhm = await MHMObject.findById(mhmId);
  } catch(err) {

  }
  if (!mhm) {
    return 'NaN';
  }
  return mhm.byname;
}

exports.createJob = createJob;
exports.getJobs = getJobs;
exports.getJobById = getJobById;
exports.assignJob = assignJob;
exports.getScheduledJobs = getScheduledJobs;
exports.getUnscheduledJobs = getUnscheduledJobs;
exports.getCompletedJobs = getCompletedJobs;
