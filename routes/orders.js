const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();
const mongoose = require('mongoose');
const { ProductQuantity } = require('../models/productQuantity');

router.post('/create', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const orderTotalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const orderTotalPrice = orderTotalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
        _id: new mongoose.Types.ObjectId(),
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        orderItems: orderItemsIdsResolved,
        //status: req.body.status,
        totalPrice: orderTotalPrice,
        user: req.body.user,
    })

    for (let i = 0; i < req.body.orderItems.length; i++) {
        const orderItem = req.body.orderItems[i];
        const productId = orderItem.product;
        const quantity = orderItem.quantity;

        // Find or create the product quantity for the given product and user
        const productQuantity = await ProductQuantity.findOneAndUpdate(
            { user: req.body.user, product: productId },
            { $inc: { quantity: quantity } },
            { upsert: true, new: true }
        ).populate('product', 'name');

        // If the product quantity was just created, set the user and product IDs
        if (!productQuantity.user || !productQuantity.product) {
            productQuantity.user = req.body.user;
            productQuantity.product = productId;
            await productQuantity.save();
        }
    }
    await ProductQuantity.updateMany({}, { $currentDate: { updatedAt: true } });


    order = await order.save();

    if (!order)
        return res.status(400).send('the order cannot be created!')

    res.json({ order });

})

router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.json({ orderList });
})

router.get(`/read/:orderID`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        });

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.json({ order });
})



router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    )

    if (!order)
        return res.status(400).send('the order cannot be update!')

    res.send(order);
})


router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({ success: true, message: 'the order is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({ totalsales: totalSales.pop().totalsales })
})

router.get(`/get/count`, async (req, res) => {
    const orderCount = await Order.countDocuments((count) => count)

    if (!orderCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        orderCount: orderCount
    });
})

router.get(`/:userID`, async (req, res) => {
    const _id = req.params.userID;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).send("Invalid Order Id");
    }

    const orders = await Order.find({ user: _id }).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    }).sort({ 'dateOrdered': -1 });

    if (!orders) {
        res.status(500).json({ success: false })
    }
    res.json({ count: orders.length, orders });
})



module.exports = router;