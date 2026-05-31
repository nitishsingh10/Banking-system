const express = require('express');
const Wallet = require('../models/wallet.model');
const router = express.Router();

// Get wallet balance for the logged-in user

router.get('/balance', async (req, res) => {

    try {
        // userID will be provided by JWT middleware
        
        const userId = req.user._id; 
        const userWallet = await Wallet.findOne({ userId });

        if (!userWallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        res.json({ balance: userWallet.balance });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;