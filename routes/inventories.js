const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { Product } = require('../models/product');

/*router.get('/', async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.params.userId }).populate({
      path: 'orderItems',
      populate: {
        path: 'product'
      },
      populate: {
        path: 'quantity'
      }
    });

    let totalQuantity = 0;

    userOrders.forEach(order => {
      order.orderItems.forEach(item => {
        totalQuantity += item.quantity;
      })
    });

    res.status(200).json({ totalQuantity });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occurred while retrieving the total quantity.' });
  }
})*/


/*router.get('/', async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await Order.find({ user: userId }).populate('product');
    let totalQuantity = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        totalQuantity += item.quantity;
      });
    });
    res.json({ totalQuantity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});*/

router.get('/:userID', async (req, res) => {
  try {
    const totalQuantity = await Order.aggregate([
      { $group: { _id: "$user", totalQuantity: { $sum: "$quantity" } } }
    ]);
    res.json({ quantity: totalQuantity[0].totalQuantity });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


router.get('/orderQuantity/:qrCode', async (req, res) => {
  try {
    const qrCode = req.params.qrCode;
    const updatedOrder = await Order.findOneAndUpdate({ qrCode: qrCode }, { $inc: { quantity: -1 } }, { new: true });
    if (!updatedOrder) {
      res.status(404).send({ message: 'Order not found' });
    } else {
      res.send({ message: 'Quantity updated successfully' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;