const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/auth.middleware');
const {sendMoney,getTransactions,getUser} = require('../controllers/transaction.controller');


router.post('/send',verifyUser,sendMoney);
router.get('/history',verifyUser,getTransactions);
router.get('/user',getUser);

module.exports = router;