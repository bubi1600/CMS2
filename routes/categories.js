const { Category } = require('../models/category');
const { User } = require('../models/user');
const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories) {
            res.status(500).json({ success: false })
        }

        res.status(200).json({ success: true, categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error retrieving categories' })
    }
})

/*router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('category');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, categories: user.category });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});*/



router.post('/create', async (req, res) => {
    let category = new Category({
        _id: new mongoose.Types.ObjectId(),
        //_id: req.body.id,
        name: req.body.name,
        //icon: req.body.icon,
        //color: req.body.color,
        //image: req.body.image,

    })

    category = await category.save();

    if (!category)
        return res.status(400).send('the category cannot be created!')

    res.send(category);
})


router.get('/read/:categoryID', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ message: 'The category with the given ID was not found.' })
    }
    res.status(200).json({ category });
})


router.get('/query/:authorID', async (req, res) => {
    const category = await Category.findById(
        req.params.id,
        {
            title: req.query,
            author_id: req.params.authorID,
        })

    const titleRegex = title ? new RegExp(title.toString(), "i") : new RegExp("");
    return Category.find({ title: { $regex: titleRegex }, author: author_id })
        .exec()
        .then((categories) => {
            return res.status(200).json({
                count: categories.length,
                categories,
            })
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
})


router.patch('/update/:categoryID', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
        },
        { new: true }
    )

    if (!category)
        return res.status(400).json({ message: err.message }).send('the category cannot be created!')

    res.send(category);
})


router.delete('/:categoryID', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "category not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

module.exports = router;