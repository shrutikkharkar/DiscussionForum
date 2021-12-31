const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const mongoose = require('mongoose')
const User = require('../models/User.model')
const userController = require('../controllers/User.controller.js')



// REGISTER

router.post('/signup', userController.signupUser);


//LOGIN
router.post('/login', userController.login);


//LOGOUT
router.get('/logout', auth, userController.logout);


router.get('/loggedIn', userController.checkIfLoggedIn);

router.get('/getUsername', auth, userController.getUsername);



module.exports = router
