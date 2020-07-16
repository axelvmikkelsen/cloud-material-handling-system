const express = require('express');
const { check } = require('express-validator');

const loginController = require('../controllers/login-controller');

const router = express.Router();

router.post(
   '/signup',
   [
     check('email')
       .normalizeEmail()
       .isEmail(),
     check('password').isLength({ min: 6 })
   ],
   loginController.signup
 );
 
 router.post('/login', loginController.login);

module.exports = router;