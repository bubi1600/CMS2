const { Product } = require('../models/product');
const express = require('express');
const { User } = require('../models/user');
const { ProductQuantity } = require('../models/productQuantity');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, '/tmp');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const products = await Product.find(filter).populate('category');

    if (!products) {
        res.status(500).json({ success: false });
    } else {
        res.status(200).json({ success: true, products });
    }
});

router.get(`/read/:productID`, async (req, res) => {
    //const product = await Product.findById(req.params.id).populate('category');
    const product = await Product.findById(req.params.productID).populate('category');


    if (!product) {
        res.status(500).json({ success: false });
    }
    res.json({ product });
});

router.post(`/create`, /*uploadOptions.single('image'),*/ async (req, res) => {

    try {
        const category = await Category.findById(req.body.category);
        console.log(category);
        if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
            return res.status(400).send('Invalid Category ID');
        };

    } catch (error) {
        console.log(error);
        return res.status(500).send('Error retrieving category');
    }

    /*const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
 
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/tmp`;
    const fullPath = path.join(basePath, fileName);*/
    try {
        let product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            description: req.body.description,
            //image: fullPath, // "http://localhost:3000/public/upload/image-2323232"
            //brand: req.body.brand,
            quantity: req.body.quantity,
            category: req.body.category,
            expiryDate: req.body.expiryDate
        });

        product = await product.save();
        if (!product) return res.status(500).send('The product cannot be created');

        // Find all users
        const users = await User.find({});

        // Loop through each user to create or update their ProductQuantity record
        for (const user of users) {
            const existingProductQuantity = await ProductQuantity.findOne({
                product: product._id,
                user: user._id
            });

            if (!existingProductQuantity) {
                const productQuantity = new ProductQuantity({
                    product: product._id,
                    quantity: req.body.quantity,
                    user: user._id,
                    expiryDate: req.body.expiryDate // Set the expiry date to the same as the new product
                });
                await productQuantity.save();
            } else {
                existingProductQuantity.quantity += req.body.quantity;
                if (existingProductQuantity.quantity > 10) {
                    existingProductQuantity.quantity = 10;
                }
                existingProductQuantity.expiryDate = req.body.expiryDate; // Set the expiry date to the same as the new product
                await existingProductQuantity.save();
            }
        }

        res.json({ product });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.put('/find/:id', /*uploadOptions.single('image'),*/ async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    /*const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }*/

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    );

    if (!updatedProduct)
        return res.status(500).send('the product cannot be updated!');

    res.send(updatedProduct);
});

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: 'the product is deleted!',
                    });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'product not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        productCount: productCount,
    });
});

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
});

/*router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        );

        if (!product)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(product);
    }
);*/

module.exports = router;

