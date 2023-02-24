const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');

router.get('/:userID', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('orderItems.product');
    const products = {};

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const productId = item.product._id.toString();
        const productPrice = item.product.price;
        const productQuantity = item.quantity;

        if (products[productId]) {
          products[productId].quantity += productQuantity;
          products[productId].totalPrice += productPrice * productQuantity;
        } else {
          products[productId] = {
            name: item.product.name,
            quantity: productQuantity,
            totalPrice: productPrice * productQuantity
          };
        }
      });
    });

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;