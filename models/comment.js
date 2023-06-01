const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    productId: {type: mongoose.Schema.Types.ObjectId,  ref: 'Product', required: true},
    content: {type: 'string', required: true},
    drink: {
        type: String,
        required: true,
        enum: ["Coffee", "Tea", "Water"],
      },
}, {timestamps: true})

module.exports = mongoose.model('Comment', CommentSchema)