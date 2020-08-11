const express = require('express');
const { check } = require('express-validator');

const mapController = require('../controllers/map-controller');

const router = express.Router();

router.post('/create_grid', mapController.createGrid);

router.post('/:grid_id/create_area', mapController.createArea);

router.get('/:grid_id/areas', mapController.getAreasByGridId);

router.post('/create_map', mapController.createMap);


module.exports = router;