const express = require('express');
const router = express.Router();
//const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');
//const { OrderItem } = require('../models/order-item');
const mongoose = require('mongoose');

router.get('/:userId', async (req, res) => {
  const _id = req.params.userID;
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send("Invalid productQuantity Id");
  }

  const productQuantities = await ProductQuantity.find({ user: _id }).populate('product', 'name');

  if (!productQuantities) {
    return res.status(500).send('The product quantities could not be retrieved.');
  }

  res.json({ count: productQuantities.length, productQuantities });
});

/*router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Group the order items by product ID and sum the quantity for each group
    const productQuantities = await OrderItem.aggregate([
      {
        $match: { user: userId }
      },
      {
        $group: {
          _id: '$product',
          quantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: '$product.name',
          quantity: 1,
          totalPrice: { $multiply: ['$quantity', '$product.price'] }
        }
      }
    ]);

    // Save the product quantities to the database
    const savedProductQuantities = await ProductQuantity.insertMany(productQuantities);

    res.json(savedProductQuantities);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})*/

/*router.get('/:userID', async (req, res) => {
  try {
    const userId = req.query.userId;
    const orderItems = await OrderItem.find({ user: userId }).populate('product');

    // Create a map to store the total quantity for each product
    const productQuantityMap = new Map();

    // Loop through each order item and update the product quantity
    orderItems.forEach(orderItem => {
      const productId = orderItem.product._id;
      const productName = orderItem.product.name;
      const orderItemQuantity = orderItem.quantity;

      if (productQuantityMap.has(productId)) {
        const currentQuantity = productQuantityMap.get(productId);
        productQuantityMap.set(productId, currentQuantity + orderItemQuantity);
      } else {
        productQuantityMap.set(productId, orderItemQuantity);
      }
    });

    // Convert the map to an array of objects and send the response
    const productQuantities = await Promise.all(Array.from(productQuantityMap.entries()).map(async ([productId, quantity]) => {
      const product = await Product.findById(productId);
      return {
        productId,
        name: product.name,
        quantity
      };
    }));

    res.json(productQuantities);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});*/


module.exports = router;