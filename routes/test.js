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
router.get(`/`, async (req, res) => {

    try {
        const tests = await Test.find();
        res.send(tests);
    } catch (error) {
        res.status(500).send('Error retrieving tests');
    }
});

module.exports = router;