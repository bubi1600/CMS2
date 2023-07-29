const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
