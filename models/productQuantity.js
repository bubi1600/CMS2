const mongoose = require('mongoose');

const productQuantitySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true
    }
});

const ProductQuantity = mongoose.model('ProductQuantity', productQuantitySchema);

module.exports = { ProductQuantity };
