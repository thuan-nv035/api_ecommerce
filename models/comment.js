const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    userId: {type: 'string', required: true},
    productId: {type: 'string', required: true},
    content: {type: 'string', required: true},
    drink: {
        type: String,
        required: true,
        enum: ["Coffee", "Tea", "Water"],
      },
}, {timestamps: true})

module.exports = mongoose.model('Comment', CommentSchema)