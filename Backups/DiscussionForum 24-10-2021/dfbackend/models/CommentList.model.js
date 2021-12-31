const mongoose = require('mongoose')

const CommentListSchema = new mongoose.Schema({
        
    answerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    commentById: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    comment: {
        type: 'string',
        required: true
    },

    likedById: [
        {type: mongoose.Types.ObjectId}
    ],

    dislikedById: [
        {type: mongoose.Types.ObjectId}
    ],

    updatedOnDate: {
        type: 'date',
        default: Date.now
    }
})

module.exports = mongoose.model('comment', CommentListSchema)