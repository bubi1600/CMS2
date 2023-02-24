const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');

router.get('/:userID', async (req, res) => {
  try {
    const productQuantities = await ProductQuantity.find();
    res.status(200).json({ productQuantities });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occurred while retrieving the product quantities.' });
  }
});

/*router.get('/:userID', async (req, res) => {
  try {
    // Find all orders for the specified user and populate the orderItems with their respective products
    const userOrders = await Order.find({ user: req.params.userID }).populate({
      path: 'orderItems',
      populate: {
        path: 'product'
      }
    });

    // Sum up the quantity of each product in the user's orders and save it in the ProductQuantity collection
    const productQuantities = {};

    for (const userOrder of userOrders) {
      for (let i = 0; i < userOrder.orderItems.length; i++) {
        const orderItem = userOrder.orderItems[i];
        if (productQuantities[orderItem.product._id]) {
          productQuantities[orderItem.product._id] += orderItem.quantity;
        } else {
          productQuantities[orderItem.product._id] = orderItem.quantity;
        }
      }
    }

    // Save the updated product quantities to the ProductQuantity collection
    for (const [productId, quantity] of Object.entries(productQuantities)) {
      const productQuantity = new ProductQuantity({
        product: productId,
        quantity: quantity
      });
      await productQuantity.save();
    }

    res.status(200).json({ productQuantities });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occurred while retrieving the total quantity.' });
  }
});*/

module.exports = router;