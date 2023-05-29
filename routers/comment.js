const Comment = require("../models/comment");
const {
    verifyToken,
    checkDeletePermission
} = require("./verifyToken");

const router = require("express").Router();

router.post("/create", verifyToken, async (req, res) => {
    const newComment = new Comment(req.body)
    try {
        const savedComment = await newComment.save()
        res.status(200).json(savedComment)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/:productId', async (req, res) => {
    try {
        const comments = await Comment.find({ productId: req.params.productId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Định nghĩa tuyến API để xóa bình luận
router.delete('/:commentId', checkDeletePermission, async (req, res) => {
    console.log('1', 1)
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


module.exports = router;
