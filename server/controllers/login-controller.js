const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const UserObject = require('../models/user');

const signup = async (req, res, next) => {
  const { email, password } = req.body;

  let createdUser;
  try {
    createdUser = await UserObject.findOne({ email: email });
    if (createdUser) {
      const error = new HttpError('User already exists, please log in', 500);
      return next(error);
    }
    console.log('Working here');
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        'Could not create user, please try again',
        500
      );
      return next(error);
    }
    console.log('Here too??');
    createdUser = new UserObject({
      email,
      password: hashedPassword,
    });
  } catch (err) {
    const error = new HttpError('User signup failed, an error occured', 500);
    return next(error);
  }

  try {
    await createdUser.save();
  } catch (err) {
    // console.log('User creation failed', err);
    const error = HttpError('Creating user failed, please try again', 500);
    return next(error);
  }

  let token;
  try {
    console.log('Is there a problem here?');
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    console.log('NO');
  } catch (err) {
    const error = new HttpError('User signup failed, an error occured', 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await UserObject.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check credentials',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('User login failed, an error occured', 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.signup = signup;
exports.login = login;
