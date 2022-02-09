const mongoose = require('mongoose')

const QuestionListTemplates = new mongoose.Schema({

    questionById: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    question: {
        type: 'string',
        required: true,
        index: "text"
    },


    viewedById: [
        {
            type: mongoose.Types.ObjectId
        }
    ],

    reportedById: [
        {
            type: mongoose.Types.ObjectId
        }
    ],

    removedById: [
        {
            type: mongoose.Types.ObjectId
        }
    ],

    tagsForQuestion: [{
        type: String,
        index: "text"
    }],

    updatedOnDate: {
        type: 'date',
        default: Date.now
    }
})

module.exports = mongoose.model('question', QuestionListTemplates)