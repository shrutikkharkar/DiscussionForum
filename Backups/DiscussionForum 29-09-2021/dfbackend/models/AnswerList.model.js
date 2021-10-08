const mongoose = require('mongoose')

const AnswerListSchema = new mongoose.Schema({
        
    questionID: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    answeredById: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    answer: {
        type: 'string',
        required: true
    },

    likes: {
        type: 'number'
    },

    dislikes: {
        type: 'number'
    },

    updatedOnDate: {
        type: 'date',
        default: Date.now
    }
})

module.exports = mongoose.model('answer', AnswerListSchema)