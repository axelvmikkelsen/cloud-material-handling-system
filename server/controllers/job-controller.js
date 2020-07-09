const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const SmartObject = require('../models/so');
const MHMObject = require('../models/mhm');
const JobObject = require('../models/job');

const createJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        'Invalid inputs passed when creating a Job, please check your input'
      )
    );
  }

  const { description, from, destination, soid } = req.body;

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
      from,
      destination,
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
    res.status(500).json({ success: false })
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
  console.log('Working on it');
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
    jobs = await JobObject.find({ status: 'assigned', workstatus: { $ne: 'completed' }});
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
}

const getUnscheduledJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await JobObject.find({ status: 'unassigned'});
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
}

const getCompletedJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await JobObject.find({ workstatus: 'completed'});
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
}

exports.createJob = createJob;
exports.getJobs = getJobs;
exports.getJobById = getJobById;
exports.assignJob = assignJob;
exports.getScheduledJobs = getScheduledJobs;
exports.getUnscheduledJobs = getUnscheduledJobs;
exports.getCompletedJobs = getCompletedJobs;
