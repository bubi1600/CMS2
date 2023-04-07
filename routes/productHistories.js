const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ProductHistory } = require('../models/productHistory');
const { ProductQuantity } = require('../models/productQuantity');
const { Product } = require('../models/product');
const { User } = require('../models/user');

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log(`Fetching product history for user ID: ${userId}`);

    // Check if the user ID is a valid ObjectId
    if (!mongoose.isValidObjectId(userId)) {
        console.log(`Invalid user ID: ${userId}`);
        return res.status(400).send('Invalid user ID.');
    }

    try {
        // Find all product history for the user
        const productHistories = await productHistories.find({ user: userId });

        console.log(`Found ${productHistories.length} product history records for user ID: ${userId}`);

        res.json(productHistories);
    } catch (error) {
        console.error(`Error getting product history: ${error}`);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;