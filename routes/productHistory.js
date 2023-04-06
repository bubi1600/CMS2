const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ProductHistory } = require('../models/productHistory');
const { Product } = require('../models/product');
const { User } = require('../models/user');

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    // Check if the user ID is a valid ObjectId
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).send('Invalid user ID.');
    }

    try {
        // Find all product history for the user
        const productHistory = await ProductHistory.find({ user: userId });

        res.json(productHistory);
    } catch (error) {
        console.error(`Error getting product history: ${error}`);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;