const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    /* images: [{
         type: String
     }],
     brand: {
         type: String,
         default: ''
     },*/
    quantity: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
        required: true
    },
    id: { type: String, unique: true },
    /*id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        unique: true,
    }*/
})


/*productSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    const { _id: id, ...result } = object;
    return { ...result, id };
});*/


exports.Product = mongoose.model('Product', productSchema);
