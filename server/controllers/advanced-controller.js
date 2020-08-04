const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const mapObject = require('../models/map');

const getInfoTable = (req, res, next) => {
  let state;
  try {
    state = mongoose.connection.readyState;
  } catch (err) {
    return next(
      new HttpError('Something went wrong when getting server status', 500)
    );
  }
//   let grid;
//   try {
//      grid = mapObject.get
//   }
  res.status(200).json({ status: true, state });
};

exports.getInfoTable = getInfoTable;
