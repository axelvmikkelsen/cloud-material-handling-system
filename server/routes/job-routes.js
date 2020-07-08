const express = require('express');
const { check } = require('express-validator');

const jobController = require('../controllers/job-controller');

const router = express.Router();

router.post('/', jobController.createJob);

router.get('/', jobController.getJobs);

router.get('/:job_id', jobController.getJobById);

router.patch('/assign', jobController.assignJob);

router.get('/table/scheduled', jobController.getScheduledJobs);
router.get('/table/unscheduled', jobController.getUnscheduledJobs);
router.get('/table/completed', jobController.getCompletedJobs);

module.exports = router;