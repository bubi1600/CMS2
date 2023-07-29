const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Test = require('../models/test');

router.post('/test', async (req, res) => {
    try {
        let test = new Test({
            quantity: req.body.quantity,
        });

        const savedTest = await test.save();
        res.send(savedTest);
    } catch (error) {
        res.status(400).send(`Failed to create test: ${error.message}`);
    }
});

router.get('/', async (req, res) => {
    try {
        const tests = await Test.find();
        res.send(tests);
    } catch (error) {
        res.status(500).send('Error retrieving tests');
    }
});

module.exports = router;
