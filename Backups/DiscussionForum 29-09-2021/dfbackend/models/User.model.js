const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv')

const userSchema = new mongoose.Schema({

    fullName: {
        type: 'string',
        required: true
    },

    userName: {
        type: 'string',
        required: true
    },

    email: {
        type: 'string',
        required: true,

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
/*
    likedAnswers: [{
        likedAnswerId:{
            type: 'string'
        }
    }],

    savedAnswers: [{
        savedAnswerId:{
            type: 'string'
        }
    }],
*/
    date: {
        type: 'date',
        default: Date.now
    }

})

const User = mongoose.model('user', userSchema)
module.exports = User;