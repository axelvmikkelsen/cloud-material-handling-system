const express = require('express');
const { check } = require('express-validator');

const soController = require('../controllers/so-controller');

const router = express.Router();

router.get('/', soController.getSmartObjects);

router.get('/:so_id', soController.getSmartObjectById);

router.post(
  '/',
  [check('name').not().isEmpty(), check('description').not().isEmpty()],
  soController.createSmartObject
);

router.patch(
  '/location/:so_id/',
  [check('locX').isNumeric(), check('locY').isNumeric()],
  soController.updateSmartObjectLocation
);

module.exports = router;
