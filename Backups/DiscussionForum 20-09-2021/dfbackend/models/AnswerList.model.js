const mongoose = require('mongoose')

const AnswerListSchema = new mongoose.Schema({
        
    questionID: {
        type: 'string',
        required: true
    },

    answeredById: {
        type: 'string',
        required: true
    },

    answer: {
        type: 'string',
        required: true
    },

    answerersName: {
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