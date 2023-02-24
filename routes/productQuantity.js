const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');
const { OrderItem } = require('../models/order-item');

router.get('/:userID', async (req, res) => {
  try {
    const userId = req.query.userId;
    const orderItems = await OrderItem.find({ user: userId }).populate('product');

    // Create a map to store the total quantity for each product
    const productQuantityMap = new Map();

    // Loop through each order item and update the product quantity
    orderItems.forEach(orderItem => {
      const productId = orderItem.product._id;
      const orderItemQuantity = orderItem.quantity;

      if (productQuantityMap.has(productId)) {
        const currentQuantity = productQuantityMap.get(productId);
        productQuantityMap.set(productId, currentQuantity + orderItemQuantity);
      } else {
        productQuantityMap.set(productId, orderItemQuantity);
      }
    });

    // Convert the map to an array of objects and send the response
    const productQuantities = Array.from(productQuantityMap, ([productId, quantity]) => ({ productId, quantity }));
    res.json(productQuantities);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;