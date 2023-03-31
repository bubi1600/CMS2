const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

async function removeExpiredProducts() {
    try {
        // Find all products that are expired
        const expiredProducts = await Product.find({
            expiryDate: { $lte: new Date() }
        });

        // Remove expired products
        for (const product of expiredProducts) {
            await product.remove();
        }

        console.log(`Removed ${expiredProducts.length} expired products`);
    } catch (error) {
        console.error(`Error removing expired products: ${error}`);
    }
}

module.exports = router;
