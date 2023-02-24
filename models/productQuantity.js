const mongoose = require('mongoose');

const productQuantitySchema = mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const ProductQuantity = mongoose.model('ProductQuantity', productQuantitySchema);

module.exports = ProductQuantity;
