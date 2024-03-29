const mongoose = require('mongoose');

const productHistorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        enum: ['add', 'remove'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

exports.ProductHistory = mongoose.model('ProductHistory', productHistorySchema);
