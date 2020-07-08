const express = require('express');
const { check } = require('express-validator');

const mhmController = require('../controllers/mhm-controller');

const router = express.Router();

router.get('/', mhmController.getMHMs);

router.get('/:mhm_id', mhmController.getMHMById);

router.post(
  '/',
  [check('name').not().isEmpty(), check('description').not().isEmpty()],
  mhmController.createMHM
);

router.patch(
  '/location/:mhm_id/',
  [check('locX').isNumeric(), check('locY').isNumeric()],
  mhmController.updateMHMLocation
);

module.exports = router;