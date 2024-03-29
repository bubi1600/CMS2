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
        validate: {
            validator: function (value) {
                // check if the value is a valid date and is not in the past
                return value && value instanceof Date && value.getTime() >= Date.now();
            },
            message: props => `${props.value} is not a valid future date`
        }
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
