const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ProductHistory } = require('../models/productHistory');
const { ProductQuantity } = require('../models/productQuantity');
const { Product } = require('../models/product');
const { User } = require('../models/user');

router.get('/:userId', async (req, res) => {
    try {
        const productHistories = await ProductHistory
            .find({ user: req.params.userId })
            .populate('product');

        if (!productHistories) {
            return res.status(500).send('The product histories could not be retrieved.');
        }

        res.status(200).json({ success: true, count: productHistories.length, productHistories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



module.exports = router;