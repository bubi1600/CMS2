const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    /*icon: {
        type: String,
    },
    color: {
        type: String,
    },
    image: {
        type: String,
    },*/
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        unique: true,
    }
})


categorySchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    const { _id: id, ...result } = object;
    return { ...result, id };
});

exports.Category = mongoose.model('Category', categorySchema);
