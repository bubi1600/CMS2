const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');

router.get('/:userID', async (req, res) => {
  try {
    const userId = req.query.userId;
    const orderItems = await OrderItem.find({ user: userId }).populate('product');

    // Create a map to store the total sum for each product
    const productSumMap = new Map();

    // Loop through each order item and update the product sum
    orderItems.forEach(orderItem => {
      const productId = orderItem.product._id;
      const productPrice = orderItem.product.price;
      const orderItemQuantity = orderItem.quantity;

      if (productSumMap.has(productId)) {
        const currentSum = productSumMap.get(productId);
        productSumMap.set(productId, currentSum + (productPrice * orderItemQuantity));
      } else {
        productSumMap.set(productId, productPrice * orderItemQuantity);
      }
    });

    // Convert the map to an array of objects and send the response
    const productSums = Array.from(productSumMap, ([productId, sum]) => ({ productId, sum }));
    res.json(productSums);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;