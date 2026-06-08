const express = require('express')
const router = express.Router();
const {register,login,verifyOtp} = require('../controllers/auth.controller');
const verify = require('../middleware/auth.middleware');



// signup route
router.post('/signup', register);

// login route
router.post('/login', login);

// otp verification route
router.post('/otp',verify ,verifyOtp);

module.exports = router;