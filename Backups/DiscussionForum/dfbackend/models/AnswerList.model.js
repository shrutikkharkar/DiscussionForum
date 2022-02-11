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

    tagsForAnswer: [
        {
            type: String
        }
    ],

    likedById: [
        {type: mongoose.Types.ObjectId}
    ],

    dislikedById: [
        {type: mongoose.Types.ObjectId}
    ],

    savedById: [{
        type: mongoose.Types.ObjectId
    }],

    reportedById: [{
        type: mongoose.Types.ObjectId
    }],

    removedById: [{
        type: mongoose.Types.ObjectId
    }],

    updatedOnDate: {
        type: 'date',
        default: Date.now
    }
})

AnswerListSchema.index({answer: 'text', tagsForAnswer: 'text'})

module.exports = mongoose.model('answer', AnswerListSchema)