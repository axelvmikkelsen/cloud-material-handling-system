const express = require('express');
const { check } = require('express-validator');

const lifecycleController = require('../lifecycle/lifecycle');

const router = express.Router();

router.post('/mqtt', lifecycleController.toggleMqtt);

router.post('/ae', lifecycleController.toggleAE);

router.get('/server/status', lifecycleController.getServerStatus)

module.exports = router;