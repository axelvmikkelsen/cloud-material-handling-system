const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const GridObject = require('../models/grid');
const ZoneObject = require('../models/zone');

const createGrid = async (req, res, next) => {
  const { name, xend, yend } = req.body;

  if (xend <= 0 || yend <= 0) {
    return next(
      new HttpError('The grid must be larger than zero, try again', 422)
    );
  }

  try {
    const createdGrid = new GridObject({
      name,
      xstart: 0,
      xend,
      ystart: 0,
      yend,
    });
    await createdGrid.save();
  } catch (err) {
    return next(new HttpError('Grid creation failed', 500));
  }

  res.status(201).json({ name });
};

const createZone = async (req, res, next) => {
  const { name, description, xstart, xend, ystart, yend } = req.body;
  const gridId = req.params.grid_id;

  if (xstart >= xend || ystart >= yend) {
    return next(
      new HttpError('Dimenions specified are invalid, please try again', 422)
    );
  }

  let grid;
  try {
    grid = await GridObject.findById(gridId);
  } catch (err) {
    return next(new HttpError('Creating zone failed', 500));
  }

  if (!grid) {
    return next(new HttpError('Could not find grid for specified id', 404));
  }
  let createdZone;
  try {
    createdZone = new ZoneObject({
      name,
      description,
      xstart,
      xend,
      ystart,
      yend,
      grid: gridId,
    });
    createdZone.save();
  } catch (err) {
    return next(new HttpError('Creating zone failed, please try again', 500));
  }

  res.status(201).json({ zone: createdZone });
};

const getZonesByGridId = async (req, res, next) => {
  const gridId = req.params.grid_id;

  let zones;
  try {
    zones = await ZoneObject.find({ grid: gridId });
  } catch (err) {
    return next(
      new HttpError('Could not retrieve zones, an error occured', 500)
    );
  }

  if (!zones) {
    return next(new HttpError('No zones found, please try again', 422));
  }

  res.json({ zones: zones.map((zone) => zone.toObject({ getters: true })) });
};

exports.createGrid = createGrid;
exports.createZone = createZone;
exports.getZonesByGridId = getZonesByGridId;
