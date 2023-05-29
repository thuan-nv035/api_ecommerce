const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');


// REGISTRY

router.post('/register', async (req, res) => {
    // res.setHeader('Content-Type', 'application/json')
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    })

    try {
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
    } catch (err) {
        res.status(500).json(err)
    }

})

router.post('/login', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    try {
        const user = await User.findOne({ username: req.body.username })
        !user && res.status(401).json('Wrong credentials')
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC, { expiresIn: "3d" })
        Originalpassword !== req.body.password && res.status(401).json('Wrong credentials')
        const { password, ...others } = user._doc
        res.status(200).json({ ...others, accessToken })
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        // Kiểm tra xem bình luận có tồn tại hay không
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        // Xóa bình luận
        await Comment.findByIdAndDelete(commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router