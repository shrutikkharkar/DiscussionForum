const mongoose = require('mongoose')

const QuestionListTemplates = new mongoose.Schema({

    questionById: {
        type: 'string',
        required: true
    },

    question: {
        type: 'string',
        required: true
    },

    answersCount: {
        type: 'number',
        required: true
    },

    viewCount: {
        type: 'number',
        required: true
    },

    votesCount: {
        type: 'number',
        required: true
    },

    updatedOnDate: {
        type: 'date',
        default: Date.now
    }
})

module.exports = mongoose.model('question', QuestionListTemplates)