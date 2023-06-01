const router = require('express').Router()
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')
const CryptoJS = require("crypto-js");
const User = require('../models/User')
const nodemailer = require('nodemailer');

// update user

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updateUser)
    } catch (e) {
        res.status(500).json(e)
    }
})


// Delete user

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user deleted ...')
    } catch (e) {
        res.status(500).json(e)
    }
})


// get user
router.get('/findById/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json({ others })
    } catch (e) {
        res.status(500).json(e)
    }
})


// get all users

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find().sort({ _id: -1 })
        res.status(200).json({ users })
    } catch (e) {
        res.status(500).json(e)
    }
})


// get user stats

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/send-email', async (req, res) => {
    try {
        // Lấy danh sách người dùng từ cơ sở dữ liệu
        const users = await User.find().lean().exec();
        // Gửi email đến từng người dùng
        for (const user of users) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.example.com', // Thay đổi thông tin SMTP của bạn
                port: 587,
                secure: true,
                auth: {
                    user: 'thuan.nv035@gmail.com', // Thay đổi email của bạn
                    pass: '8XyTFgBDynWY*DpgA*dNKF5a8BZ' // Thay đổi mật khẩu của bạn
                }
            });

            const mailOptions = {
                from: '<thuan> thuan.nv035@gmail.com', // Thay đổi email của bạn
                to: user.email,
                subject: 'Test Email',
                text: `Hello ${user.name}, This is a test email!`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Đã gửi email thành công đến ${user.email}`);
        }

        res.send('Email đã được gửi thành công');
    } catch (err) {
        console.error('Lỗi gửi email:', err);
        res.status(500).send('Đã có lỗi xảy ra');
    }
});

module.exports = router