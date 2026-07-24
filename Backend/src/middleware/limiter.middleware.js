const rateLimit = require('express-rate-limit');
 
/*
    trust proxy is already set in main.js (app.set('trust proxy', true)),
    which is required for express-rate-limit to read the real client IP
    behind Render's reverse proxy instead of limiting the proxy's IP.
*/
 
// general limiter for login, signup, forgot-password
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per IP per window
    standardHeaders: 'draft-7', // pinned explicitly: 'true' is a draft-6 alias that may change meaning in a future major release
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again after some time' }
});
 
// more strict limiter for otps
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // matches the OTP expiry window
    max: 8,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many OTP attempts, please try again later' }
});
 
module.exports = { authLimiter, otpLimiter };
 