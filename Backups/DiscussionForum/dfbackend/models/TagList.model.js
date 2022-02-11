const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({

    tagName:{
        type: 'string',
        unique: true
    },
    
    followedById: [{
        type: mongoose.Types.ObjectId
    }],

    date: {
        type: 'date',
        default: Date.now
    }

})

const Tag = mongoose.model('tag', tagSchema)
module.exports = Tag;