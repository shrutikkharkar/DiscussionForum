const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    fullName: {
        type: 'string',
        required: true
    },

    userName: {
        type: 'string'
    },

    email: {
        type: 'string',
        required: true,
        unique: true
    },

    Class: {
        type: 'string',
        required: true
    },

    branch: {
        type: 'string',
        required: true
    },

    password: {
        type: 'string',
        required: true
    },

    isAdmin: {
        type: 'boolean',
        default: false
    },

    isCollegeId: {
        type: 'boolean',
        default: false
    },

    blockedById: [
        {
            type: mongoose.Types.ObjectId
        }
    ],

    verified: {
        type: 'boolean',
        default: false
    },

    verificationToken: {
        type: 'string'
    },

    date: {
        type: 'date',
        default: Date.now
    }

})

const User = mongoose.model('user', userSchema)
module.exports = User;