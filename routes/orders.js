const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/create', async (req, res) => {
    try {
        const orderItemsIds = await Promise.all(
            req.body.orderItems.map(async (orderItem) => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                });

                newOrderItem = await newOrderItem.save();

                return newOrderItem._id;
            })
        );

        const orderItems = await OrderItem.find({ _id: { $in: orderItemsIds } }).populate(
            'product',
            'price'
        );

        const orderTotalPrice = orderItems.reduce((acc, orderItem) => {
            return acc + orderItem.product.price * orderItem.quantity;
        }, 0);

        let order = new Order({
            _id: new mongoose.Types.ObjectId(),
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            orderItems: orderItemsIds,
            totalPrice: orderTotalPrice,
            user: req.body.user,
        });
        order = await order.save();

        if (!order) {
            return res.status(400).send('The order cannot be created!');
        }

        // Update the product quantity in the ProductQuantity collection
        for (const orderItem of orderItems) {
            const { product, quantity } = orderItem;
            const productQuantity = await ProductQuantity.findOne({ product: product._id, user: req.body.user });

            if (productQuantity) {
                productQuantity.quantity += quantity;
                await productQuantity.save();
            } else {
                const newProductQuantity = new ProductQuantity({
                    product: product._id,
                    quantity,
                    user: req.body.user,
                });
                await newProductQuantity.save();
            }
        }

        res.json({ order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while creating the order.' });
    }
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