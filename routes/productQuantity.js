const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');

router.get('/:userID', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderID)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'category'
        }
      })
      .lean(); // Add lean() to convert the Mongoose document to a plain JavaScript object

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Extract the products from the order items
    const products = order.orderItems.map(item => item.product);

    res.json({ order, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;