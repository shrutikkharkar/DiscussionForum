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
    // ,

    // tokens: [{
    //     token: {
    //         type: 'string',
    //         required: true
    //     }
    // }]
})

// signupTemplates.methods.generateAuthToken = async function (){
//     try{
//         const token = await jwt.sign({_id: this._id.toString()}, process.env.ACCESS_TOKEN_SECRET)
//         this.tokens = this.tokens.concat({token:token});
//         await this.save();
//         return token;
//     }
//     catch(err){
//         console.log("Error:" + err);
//     }
// }

const User = mongoose.model('user', userSchema)
module.exports = User;