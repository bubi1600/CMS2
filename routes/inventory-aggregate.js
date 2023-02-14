const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/inventory', async (req, res) => {
  try {
    const totalQuantity = await Order.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
    ]);
    res.send({ quantity: totalQuantity[0].totalQuantity });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;