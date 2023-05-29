const router = require('express').Router()
const {verifyTokenAndAuthorization , verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require("crypto-js");
const Product = require('../models/Product')


// CREATE PRODUCT

router.post('/create', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const saveProduct = await  newProduct.save()
        res.status(200).json(saveProduct)
    }catch (err) {
        res.status(500).json(err)
    }
})

// update product

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateProduct = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        }, {new: true})
        res.status(200).json(updateProduct)
    }catch (e) {
        res.status(500).json(e)
    }
})


// Delete

router.delete('/:id', verifyTokenAndAdmin, async (req, res)=> {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('product deleted ...')
    }catch (e) {
        res.status(500).json(e)
    }
})


// get detail
router.get('/findById/:id', verifyTokenAndAdmin, async (req, res)=> {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json({product})
    }catch (e) {
        res.status(500).json(e)
    }
})

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const status = {status: true }
    try {
        let products;

        if (qNew) {
            products = await Product.find(status).sort({ createdAt: -1 }).limit(1)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find(status);
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router