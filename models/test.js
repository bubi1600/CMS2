const mongoose = require('mongoose');

const testSchema = mongoose.Schema({

    quantity: {
        type: Number,
        required: true,
    }

});

exports.test = mongoose.model('test', testSchema);
