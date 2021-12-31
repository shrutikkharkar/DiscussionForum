const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')



//SAMPLE TEMPLATE

// REGISTER

router.post('/signup', async (req, res) => {
    try{
        const {fullName, userName, email, Class, branch, password} = req.body;

        // VALIDATION

        if(!fullName || !email)
            return res
                .status(400)
                .json({errorMessage: 'Please enter valid credentials'});

        // if(password !== confirmPassword)
        //     return res.status(400).json({errorMessage: 'Please enter valid password'});

        const existingUser = await User.findOne({email});
        if(existingUser)
            return res.status(400).json({errorMessage: 'User already exists'});

        const saltPassword = await bcrypt.genSalt(10)
        const passwordHashed = await bcrypt.hash(password, saltPassword)   
         
        const newUser = new User({
            fullName, userName, email, Class, branch, password: passwordHashed
        });

        const savedUser = await newUser.save();

        // Sign the token

        const token = jwt.sign({user: savedUser._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1 day'});

        // Send the token in a HTTP only cookie
        res.cookie("token", token, {httpOnly: true}).send();


        console.log(token);

    } 
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

//status 400: error from frontend(bad request, invalid input)
//status 500: error in server
//status 401: Unauthorized


//LOGIN
router.post('/login', async (req, res) => {
    try{

        // VALIDATE
        const {email, password} = req.body;

        if(!email || !password)
            return res
            .status(400)
            .json({errorMessage: 'Please enter required credentials'});

        const existingUser = await User.findOne({email});
        if(!existingUser)
            return res.status(401).json({errorMessage: 'Wrong email or password'});

        const passwordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!passwordCorrect)
            return res.status(401).json({errorMessage: 'Wrong email or password'});

        // Sign the token

        const token = jwt.sign({user: existingUser._id}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1 day'});

        // Send the token in a HTTP only cookie
        res.cookie("token", token, {httpOnly: true}).send();


        console.log(token);

    } 
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})


//LOGOUT
router.get('/logout', auth, (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    }).send();
});


router.get('/loggedIn', (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.json(false);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        res.send(true);
    }
    catch (err) {
        console.error(err);
        res.json(false);
    }
});

router.get('/getUsername', auth, async (req, res) => {
    try{
        let userId = mongoose.Types.ObjectId(req.user);
        await User.aggregate([{$match:{"_id" : userId}}, {$project: {'userName': 1}}])
        .then((users) => {
            if(users){
                res.json(users);
            }
            else {
                res.json({users: null});
            }
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})




router.get('/get', async (req, res) => {
    User.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    })
})

router.patch('/savedAnswer/:id', async (req, res) => {
    
    var userId = "6110da0de372a240cc6b2224"
    db.users.patch({_id: userId},
        {"savedAnswers": [{"savedAnswerId": req.params.id}]} )
})


router.get('/get/:id', async (req, res) => {
    let id = req.params.id;
    User.findById(id, function (err, users) {
        res.json(users);
    })
})


module.exports = router
