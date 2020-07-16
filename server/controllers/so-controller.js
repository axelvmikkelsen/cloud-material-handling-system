const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const SmartObject = require('../models/so');

const getSmartObjects = async (req, res, next) => {
  let smartobjects;
  console.log('Request made')
  try {
    smartobjects = await SmartObject.find({});
  } catch (err) {
    return next(new HttpError('Could not retrieve Smart Objects', 500));
  }
  try {
   res.json({
      objects: smartobjects.map((so) => so.toObject({ getters: true })),
    });
  } catch(err) {
     return next(new HttpError('No Smart Objects found in the DB', 500));
  }
    
};

const getSmartObjectById = async (req, res, next) => {
  const smartObjectId = req.params.so_id;
  let smartObject;
  try {
    smartObject = await SmartObject.findById(smartObjectId);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not find a Smart Object', 500)
    );
  }
  if (!smartObject) {
    return next(
      new HttpError('Could not find a Smart Object with the provided id', 404)
    );
  }
  res.json({ object: smartObject.toObject({ getters: true }) }); // Converts into javascript objects and converts the ID.
};

const createSmartObject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        'Invalid inputs passed when creating a Smart Object, please check your input'
      )
    );
  }

  const { name, description, transportclass, location } = req.body;

  let createdSO;
  try {
   //  createdSO = await SmartObject.findOne({ name: name });
   //  if (createdSo) {
   //    return next(
   //      new HttpError('The name is already taken, please select another', 500)
   //    );
   //  }

    createdSO = new SmartObject({
      name,
      type: 'so',
      status: 'Unassigned',
      transportclass,
      location: {
        x: -1,
        y: -1
      },
      description,
      zone: 'NaN',
      lastseen: (Date.now() + (4*60*60*1000))/1000
    });
  } catch (err) {
    return next(
      new HttpError('Smart Object creation failed, an error occured', 500)
    );
  }

  try {
    await createdSO.save();
  } catch (err) {
    return next(
      new HttpError('Smart Object save failed, please try again', 500)
    );
  }

  res.status(201).json({ created: createdSO, success: true });
};

const updateSmartObjectLocation = async (req, res, next) => {
   const smartObjectId = req.params.so_id;
   const { locX, locY } = req.body;

   let smartObject;
   try {
      smartObject = await SmartObject.findById(smartObjectId);
   } catch (err) {
      return next( new HttpError('The code failed to execute update', 500));
   }

   smartObject.location.x = locX;
   smartObject.location.y = locY;

   try {
      await smartObject.save();
   } catch (err) {
      return next(new HttpError('Could not save the location to the Smart Object', 500));
   }

   res.status(200).json({ smartObject: smartObject.toObject({ getters: true }) });
};


exports.getSmartObjects = getSmartObjects;
exports.getSmartObjectById = getSmartObjectById;
exports.createSmartObject = createSmartObject;
exports.updateSmartObjectLocation = updateSmartObjectLocation;