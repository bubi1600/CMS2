const { Category } = require('../models/category');
const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();

router.post('/create', async (req, res) => {
    let category = new Category({
        _id: req.body.id,
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        image: req.body.image,

    })

    category = await category.save();

    if (!category)
        return res.status(400).json({ message: err.message }).send('the category cannot be created!')

    return res.send(category.name, category._id);
})

router.get('/read/:categoryID', async (req, res) => {
    const _id = await Category.findById(req.params.id);

    if (!_id) {
        res.status(500).json({ message: 'The category with the given ID was not found.' })
    }
    res.status(200).send(_id).json({ message: err.message });
})


router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.status(200).json({ message: err.message }).send(categoryList);
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