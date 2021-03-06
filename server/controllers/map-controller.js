const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const GridObject = require('../models/grid');
const AreaObject = require('../models/area');
const MapObject = require('../models/map');
const { create } = require('../models/area');

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

const createArea = async (req, res, next) => {
  const { name, xstart, xend, ystart, yend, gridId} = req.body;

  if (xstart >= xend || ystart >= yend) {
    return next(
      new HttpError('Dimenions specified are invalid, please try again', 422)
    );
  }

  let grid;
  try {
    grid = await GridObject.findById(gridId);
  } catch (err) {
    return next(new HttpError('Creating area failed', 500));
  }

  if (!grid) {
    return next(new HttpError('Could not find grid for specified id', 404));
  }
  let createdArea;
  try {
    createdArea = new AreaObject({
      name,
      xstart,
      xend,
      ystart,
      yend,
      grid: gridId,
    });
    createdArea.save();
  } catch (err) {
    return next(new HttpError('Creating area failed, please try again', 500));
  }

  res.status(201).json({ area: createdArea });
};

const getAreasByGridId = async (req, res, next) => {
  const gridId = req.params.grid_id;

  let areas;
  try {
    areas = await AreaObject.find({ grid: gridId });
  } catch (err) {
    return next(
      new HttpError('Could not retrieve areas, an error occured', 500)
    );
  }

  if (!areas) {
    return next(new HttpError('No areas found, please try again', 422));
  }

  res.json({ areas: areas.map((area) => area.toObject({ getters: true })) });
};

const getActiveMap = async (req, res, next) => {

  let activeMap;
  try {
    activeMap = await MapObject.find({ active: true });
  } catch (err) {
    return next(
      new HttpError('Could not retrieve the active map', 500)
    );
  }

  res.status(200).json({ activeMap });
}

const setActiveMap = async (req, res, next) => {

  const mapId = req.body.map_id;

  let lastActiveMap;
  try {
    lastActiveMap = await MapObject.find({ active: true });
  } catch (err) {
    return next(
      new HttpError('Could not retrieve an active map', 500)
    );
  }

  if (lastActiveMap.length > 1) {
    return next(
      new HttpError('More than one active map was found, please edit this manually in the DB', 500)
    );
  }

  let newActiveMap;
  try {
    newActiveMap = await MapObject.findById(mapId);
  } catch (err) {
    return next(
      new HttpError('Could not find the map you wanted to activate', 500)
    );
  }

  try {
    if (lastActiveMap) {
      lastActiveMap.active = false;
    }
    newActiveMap.active = true;
  } catch (err) {
    return next(
      new HttpError('Something went wrong when mutating the active map fields', 500)
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  await lastActiveMap.save({ session: session });
  await newActiveMap.save({ session: session });
  await session.commitTransaction();

  res.status(200).json({ success: true, newActiveMap })
}

const createMap = async (req, res, next) => {

  const { name, description, gridId, areasObject } = req.body;

  let grid;
  try {
    grid = await GridObject.findById(gridId);
    if (!grid) {
      return next(
        new HttpError('Could not find the grid specified in the map creation', 500)
      );
    }
  } catch (err) {
    return next(
      new HttpError('Something went wrong trying to find the grid with the specified ID', 500)
    )
  }

  let createdMap;
  try {
    createdMap = new MapObject({
      name,
      description,
      grid: gridId,
      area: []
    });
    createdMap.save();
  } catch (err) {
    return next(
      new HttpError('Could not add fields to the object', 422)
    )
  }
  res.status(201).json({ success: true, createdMap })
}

exports.createGrid = createGrid;
exports.createArea = createArea;
exports.getAreasByGridId = getAreasByGridId;
exports.getActiveMap = getActiveMap;
exports.setActiveMap = setActiveMap;
exports.createMap = createMap;
