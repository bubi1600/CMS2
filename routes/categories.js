/*const { Category } = require('../models/category');
const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(categoryList);
})

router.get('/:id', async (req, res) => {
    const _id = await Category.findById(req.params.id);

    if (!_id) {
        res.status(500).json({ message: 'The category with the given ID was not found.' })
    }
    res.status(200).send(_id);
})



router.post('/create', async (req, res) => {
    let category = new Category({
        _id: new Mongoose.Types.ObjectId(),
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        image: req.body.image,

    })
    category = await category.save();

    if (!category)
        return res.status(400).send('the category cannot be created!')

    res.send(category);
})


router.put('/:id', async (req, res) => {
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
        return res.status(400).send('the category cannot be created!')

    res.send(category);
})

router.delete('/:id', (req, res) => {
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

module.exports = router;*/

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var logging_1 = require("../config/logging");
var category_1 = require("../models/category");
var create = function (req, res, next) {
    logging_1.default.info("Attempting to register category...");
    var _a = req.body, name = _a.name, image = _a.image, icon = _a.icon, color = _a.color;
    var category = new category_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name: name,
        icon: icon,
        color: color,
        image: image,
    });
    return category
        .save()
        .then(function (newCategory) {
            logging_1.default.info("New category created...");
            return res.status(201).json({ category: newCategory });
        })
        .catch(function (error) {
            logging_1.default.error(error);
            return res.status(500).json({ error: error });
        });
};
var read = function (req, res, next) {
    var _id = req.params.categoryID;
    logging_1.default.info("Incoming read for ".concat(_id, " ..."));
    return category_1.default.findById(_id)
        .then(function (category) {
            if (category) {
                return res.status(200).json({ category: category });
            }
            else {
                return res.status(404).json({ message: "category not found" });
            }
        })
        .catch(function (error) {
            logging_1.default.error(error);
            return res.status(500).json({ error: error });
        });
};
var readAll = function (req, res, next) {
    // const author_id = req.params.authorID;
    logging_1.default.info("Incoming read all...");
    return (category_1.default.find() // { author: author_id }
        // .populate("author")
        .exec()
        .then(function (categories) {
            return res.status(200).json({
                count: categories.length,
                categories: categories,
            });
        })
        .catch(function (error) {
            logging_1.default.error(error);
            return res.status(500).json({ error: error });
        }));
};
var query = function (req, res, next) {
    var title = req.query.title;
    var author_id = req.params.authorID;
    logging_1.default.info("Incoming query...");
    var titleRegex = title ? new RegExp(title.toString(), "i") : new RegExp("");
    return category_1.default.find({ title: { $regex: titleRegex }, author: author_id })
        .exec()
        .then(function (categories) {
            return res.status(200).json({
                count: categories.length,
                categories: categories,
            });
        })
        .catch(function (error) {
            logging_1.default.error(error);
            return res.status(500).json({ error: error });
        });
};
var update = function (req, res, next) {
    var _id = req.params.categoryID;
    logging_1.default.info("Incoming update for ".concat(_id, " ..."));
    return category_1.default.findById(_id)
        .exec()
        .then(function (category) {
            if (category) {
                category.set(req.body);
                category
                    .save()
                    .then(function (newCategory) {
                        logging_1.default.info("Category updated...");
                        return res.status(201).json({ category: newCategory });
                    })
                    .catch(function (error) {
                        logging_1.default.error(error);
                        return res.status(500).json({ error: error });
                    });
            }
            else {
                return res.status(404).json({ message: "category not found" });
            }
        })
        .catch(function (error) {
            logging_1.default.error(error);
            return res.status(500).json({ error: error });
        });
};
var deleteCategory = function (req, res, next) {
    var _id = req.params.categoryID;
    logging_1.default.info("Incoming delete for ".concat(_id, " ..."));
    return category_1.default.findByIdAndDelete(_id)
        .then(function (category) {
            return res.status(200).json({ message: "Category was deleted." });
        })
        .catch(function (error) {
            logging_1.default.error(error);
            return res.status(500).json({ error: error });
        });
};
exports.default = {
    create: create,
    read: read,
    readAll: readAll,
    query: query,
    update: update,
    deleteCategory: deleteCategory,
};
