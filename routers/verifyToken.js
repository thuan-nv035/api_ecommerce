const jwt = require('jsonwebtoken');
const Comment = require('../models/comment');


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    jwt.verify(token, process.env.JWT_SEC, (error, user) => {
        if (error) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        req.user = user;
        next();
    });
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json('You are not alowed to access this page')
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log(req)
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json('You are not alowed to access this page')
        }
    })
}

const checkDeletePermission = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { commentId } = req.params;
            const userId = req.user.id; // Giả sử user id được lưu trong req.user.id sau khi xác thực
            // Tìm bình luận
            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            // Kiểm tra quyền xóa bình luận
            if (comment.userId !== userId && !req.user.isAdmin) {
                return res.status(403).json({ error: 'You are not alowed to access this page' });
            }

            // Người dùng có quyền xóa, tiếp tục đến middleware tiếp theo hoặc xử lý tuyến API
            next();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })

};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, checkDeletePermission }