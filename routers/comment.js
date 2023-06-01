const Comment = require("../models/comment");
const User = require('../models/User')

const {
    verifyToken,
    checkDeletePermission
} = require("./verifyToken");

const router = require("express").Router();

router.post("/create", verifyToken, async (req, res, next) => {

    const newComment = new Comment(req.body)

    try {
        const savedComment = await newComment.save()
        res.status(200).json(savedComment)
    } catch (err) {
        res.status(500).json({
            success: false,
        })
    }
})

router.get('/:productId', async (req, res) => {
    try {
        const comments = await Comment.find({ productId: req.params.productId }).populate('userId', 'username') // Populate user information (username, email)
            .exec();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:commentId', checkDeletePermission, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        await Comment.findByIdAndDelete(commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
