const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const MHMObject = require('../models/mhm');

const getMHMs = async (req, res, next) => {
  let mhms;
  try {
    mhms = await MHMObject.find({});
  } catch (err) {
    return next(
      new HttpError('Could not retrieve Material Handling Modules', 500)
    );
  }

  try {
    res.json({
      objects: mhms.map((mhm) => mhm.toObject({ getters: true })),
    });
  } catch (err) {
    return next(
      new HttpError('No Material Handling Modules found in the DB', 500)
    );
  }
};

const createMHM = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        'Invalid inputs passed when creating a Material Handling Module, please check your input'
      )
    );
  }

  const { name, description, transportclass, location } = req.body;

  let createdMHM;
  try {
    // What if there already exists one?
    createdMHM = new MHMObject({
      name,
      type: 'mhm',
      status: 'available',
      workstatus: 'idle',
      transportclass,
      location: {
        x: -1,
        y: -1
      },
      description,
      area: 'NaN',
      lastseen: (Date.now() + (4*60*60*1000))/1000
    });
  } catch (err) {
    return next(
      new HttpError(
        'Material Handling Module creation failed, an error occured',
        500
      )
    );
  }

  try {
    await createdMHM.save();
  } catch (err) {
    return next(
      new HttpError(
        'Saving the Material Handling Module failed, please try again',
        500
      )
    );
  }

  res.status(201).json({ created: createdMHM, success: true });
};

const getMHMById = async (req, res, next) => {
  const mhmObjectId = req.params.mhm_id;
  let mhmObject;
  try {
    mhmObject = await MHMObject.findById(mhmObjectId);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not find a Material Handling Module', 500)
    );
  }
  if (!mhmObject) {
    return next(
      new HttpError('Could not find a Material Handling Module with the provided id', 404)
    );
  }
  res.json({ object: mhmObject.toObject({ getters: true }) });
};

const updateMHMLocation = async (req, res, next) => {
   const mhmObjectId = req.params.mhm_id;
   const { locX, locY } = req.body;

   let mhmObject;
   try {
      mhmObject = await MHMObject.findById(mhmObjectId);
   } catch (err) {
      return next( new HttpError('The code failed to execute update', 500));
   }

   mhmObject.location.x = locX;
   mhmObject.location.y = locY;

   try {
      await mhmObject.save();
   } catch (err) {
      return next(new HttpError('Could not save location to the Material Handling Module', 500));
   }

   res.status(200).json({ object: mhmObject.toObject({ getters: true }) });
};

exports.getMHMs = getMHMs;
exports.createMHM = createMHM;
exports.getMHMById = getMHMById;
exports.updateMHMLocation = updateMHMLocation;
