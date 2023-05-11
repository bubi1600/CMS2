const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/test', async (req, res) => {
    let test = new test({
        quantity: req.body.quantity,
    })

    test = await test.save();

    if (!test)
        return res.status(400).send('the category cannot be created!')

    res.send(test);
})

module.exports = router;