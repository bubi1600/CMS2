const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');

router.get('/inventory', async (req, res) => {
  try {
    const totalQuantity = await Order.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
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