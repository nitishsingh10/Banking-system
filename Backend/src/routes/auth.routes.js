const express = require('express')
const router = express.Router();
const {register,login,logout,verifyOtp,forgetPassword,resetPassword} = require('../controllers/auth.controller');
const verifyUser = require('../middleware/auth.middleware');
const {limitUser,limitOtp} = require('../middleware/limiter.middleware');

// verifyUser -> JWT auth middleware
// limitUser -> prevents brute force attempts
// limitOtp -> liits number of otp requests

// signup route
router.post('/signup', limitUser, register);

// login route
router.post('/login', limitUser, login);

// logout route 
router.post('/logout', verifyUser,logout); // only verified user can logout

// otp verification route
router.post('/otp', limitOtp, verifyOtp);

//forgetting password
router.post('/forgetPassword', limitUser, forgetPassword);

//resetting password
router.post('/resetPassword', limitOtp, resetPassword);

module.exports = router;