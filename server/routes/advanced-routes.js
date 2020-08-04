const express = require('express');
const { check } = require('express-validator');

const advancedController = require('../controllers/advanced-controller');

const router = express.Router();

router.get('/info', advancedController.getInfoTable);

module.exports = router;