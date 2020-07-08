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
   assignInterval = setInterval(() => assignJobs(jobStack), 15000);
   console.log('Assignment engine started')
}

const shutdown = () => {
   clearInterval(assignInterval);
}

const findAllUnassigned = async () => {
   return await JobObject.find({ status: 'unassigned' }).sort({ createdtime: 1 }).exec();
}

const assignJobs = async (jobStack) => {
   console.log('Assigning jobs')
   const checkJobs = await findAllUnassigned();
   console.log(checkJobs)
   if (checkJobs !== jobStack) {
      jobStack = checkJobs;
   }
   console.log('Still going')
   for (let i = 0; i < jobStack.length; i++) {
      await findCandidate(jobStack[i]);
   }
}

const findCandidate = async (job) => {
   console.log('Trying to find candidate')
   const mhms = await MHMObject.find({ status: 'available' });
   if (mhms.length === 0) {
      return;
   }

   // Lower score the better
   let bestCandidate = {
      mhmid: '',
      score: Number.POSITIVE_INFINITY
   }

   for (var i = 0; i < mhms.length; i++) {
      mhms[i].score = calculateScore(mhms[i], job);
      if (mhms[i].score < bestCandidate.score) {
         bestCandidate.mhmid = mhms[i]._id;
         bestCandidate.score = mhms[i].score;
      }
   }

   console.log('bestCandidate', bestCandidate)

   if (bestCandidate.mhmid === '') {
      return;
   }

   let mhm;
   try {
      mhm = await MHMObject.findById(bestCandidate.mhmid);
   } catch (err) {
      throw new HttpError('Could not find the best mhm candidate');
   }

   console.log('Found a suitable candidate!', mhm);

   try {
      job.mhm = bestCandidate.mhmid;
      job.status = 'assigned';
      job.workstatus = 'pick-up';
      mhm.status = 'occupied';
      mhm.workstatus = 'pick-up';
   } catch (err) {
      throw new HttpError('Fields could not be updated', 500);
   }

   try {
      console.log('Trying to save job', job);
      console.log('Trying to save mhm', mhm);
      const session = await mongoose.startSession();
      session.startTransaction();
      await job.save({ session: session });
      await mhm.save({ session: session });
      await session.commitTransaction();
      console.log('Assigned job successfully')
   } catch (err) {
      throw new HttpError('Could not save after assigning job, something went wrong', 422);
   }

}

const calculateScore = (mhm, job) => {
   return measures.euclideanDistance(mhm.location, job.from);
} 

exports.init = init;
exports.shutdown = shutdown;