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
        required: true,
        index: "text"
    },

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

    tagsForAnswer: [{
        type: String,
        index: "text"
    }],

    updatedOnDate: {
        type: 'date',
        default: Date.now
    }
})

module.exports = mongoose.model('answer', AnswerListSchema)