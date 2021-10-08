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




/*
router.post('/signup', async (req, res) => {

    const saltPassword = await bcrypt.genSalt(10)
    //const saltPassword = await bcrypt.genSalt()
    const encryptedPassword = await bcrypt.hash(req.body.password, saltPassword)


    const signedupUser = new User({
        fullName: req.body.fullName,
        userName: req.body.userName,
        email: req.body.email,
        class: req.body.class,
        branch: req.body.branch,
        password: encryptedPassword
    })

    console.log(signedupUser)
    const token = await signedupUser.generateAuthToken();
    console.log("Token is:" + token);
    
    

    signedupUser.save()
    .then((data) => {
        res.status(200).json({'message': 'Signed up successfully'})
        // return res.json(data)
        // res.json({message: 'Signed up successfully'})
        //res.status(200).json({'signedupUser': 'Added successfully'})
    })
    .catch(err => {
        return res.json(err)
        // res.status(400).send('Adding failed')
    })
})
*/


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

// router.post('/login', async (req, res) => {
//     var email = req.body.email;
//     var password = req.body.password;

//     User.findOne({ email: email})
//     .then((users) => {
//         if(users){
//             bcrypt.compare(password, users.password, function (err, result) {
//                 if(err){
//                     res.json({
//                         message: null
//                     })
//                     // res.json({
//                     //     error: err
//                     // })
//                 }
//                 if(result){

//                     // const createToken = async() => {
//                     //     const token = await jwt.sign({_id: users._id}, process.env.ACCESS_TOKEN_SECRET, {
//                     //       expiresIn: '1 day'
//                     //     });
//                     //     console.log(token)
                      
//                     //     const userVerify = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//                     //     console.log(userVerify)
//                     // }

//                     const payload = {
//                         id: users.id,
//                         fullName: users.fullName
//                       };
                    
//                       jwt.sign(
//                         payload,
//                         process.env.ACCESS_TOKEN_SECRET,
//                         {
//                           expiresIn: 31556926 // 1 year in seconds
//                         },
//                         (err, token) => {
//                           res.json({
//                             success: true,
//                             token: "Bearer " + token
//                           });
//                         }
//                       );
                      
//                     // createToken()
//                     // res.json({
//                     //     message: "Login successful!",
//                     // })


//                     // let token = jwt.sign({email: users.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1h'})
//                     // res.json({
//                     //     message: "Login successful!",
//                     //     token: token
//                     // })
//                 }else{
//                     res.json({
//                         message: null
//                     })
//                     // res.json({
//                     //     message: "Password did not match"
//                     // })
//                 }
//             })
//         }else{
//             res.json({
//                 message: null
//             })
//             // res.json({
//             //     message: "No users found"
//             // })

//         }
//     })
// })


// router.post('/login', async (req, res) => {

//     const user = users.find((users) => users.email === req.body.email)
//     if(user == null) {
//         return res.setStatus(400).send('Cannot find user')
//     }
//     try {
//         if(await bcrypt.compare(req.body.password, user.password)){
//             res.send('Success')
//         }
//         else{
//             res.send('Not allowed')
//         }
//     }
//     catch(err) {
//         res.status(500).send()
//     }
// })




router.get('/get/:id', async (req, res) => {
    let id = req.params.id;
    User.findById(id, function (err, users) {
        res.json(users);
    })
})




/*


router.post('/login', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email})
    .then((users) => {
        if(users){
            bcrypt.compare(password, users.password, function (err, result) {
                if(err){
                    res.json({
                        error: err,
                        isSuccessful: false
                    })
                }
                if(result){
                    //let token = jwt.sign({email: users.email}, 'verySecretValue', {expiresIn:'1h'})
                    
                    const createToken = async() => {
                        const token = await jwt.sign({_id: users._id}, process.env.ACCESS_TOKEN_SECRET, {
                          expiresIn: '1 day'
                        });
                        console.log(token)
                      
                        const userVerify = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
                        console.log(userVerify)
                    }
                                              
                    createToken()

                    res.json({
                        message: "Login successful!",
                        isSuccessful: true,
                        
                    })

                }
                else{
                    res.json({
                        message: "Password did not match",
                        isSuccessful: false
                    })
                }
            })
        }else{
            res.json({
                message: "No users found",
                isSuccessful: false
            })

        }
    })
})





*/








// const express = require('express');
// const router = express.Router();
// const User = require('../models/Signup.model')
// const bcrypt = require('bcrypt')
// const dotenv = require('dotenv')
// const jwt = require('jsonwebtoken')

// router.post('/signup', async (req, res) => {

//     const saltPassword = await bcrypt.genSalt(10)
//     //const saltPassword = await bcrypt.genSalt()
//     const encryptedPassword = await bcrypt.hash(req.body.password, saltPassword)


//     const signedupUser = new User({
//         fullName: req.body.fullName,
//         userName: req.body.userName,
//         email: req.body.email,
//         class: req.body.class,
//         branch: req.body.branch,
//         password: encryptedPassword
//     })

//     console.log(signedupUser)
//     const token = await signedupUser.generateAuthToken();
//     console.log("Token is:" + token);
    
    

//     signedupUser.save()
//     .then((data) => {
//         res.status(200).json({'message': 'Signed up successfully'})
//         // return res.json(data)
//         // res.json({message: 'Signed up successfully'})
//         /*res.status(200).json({'signedupUser': 'Added successfully'})*/
//     })
//     .catch(err => {
//         return res.json(err)
//         // res.status(400).send('Adding failed')
//     })
// })


// router.get('/get', async (req, res) => {
//     User.find(function(err, users) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(users);
//         }
//     })
// })

// router.post('/login', async (req, res) => {
//     var email = req.body.email;
//     var password = req.body.password;

//     User.findOne({ email: email})
//     .then((users) => {
//         if(users){
//             bcrypt.compare(password, users.password, function (err, result) {
//                 if(err){
//                     res.json({
//                         message: null
//                     })
//                     // res.json({
//                     //     error: err
//                     // })
//                 }
//                 if(result){

//                     const createToken = async() => {
//                         const token = await jwt.sign({_id: users._id}, process.env.ACCESS_TOKEN_SECRET, {
//                           expiresIn: '1 day'
//                         });
//                         console.log(token)
                      
//                         const userVerify = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//                         console.log(userVerify)
//                     }
                      
                      
//                     createToken()
//                     res.json({
//                         message: "Login successful!",
//                     })


//                     // let token = jwt.sign({email: users.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1h'})
//                     // res.json({
//                     //     message: "Login successful!",
//                     //     token: token
//                     // })
//                 }else{
//                     res.json({
//                         message: null
//                     })
//                     // res.json({
//                     //     message: "Password did not match"
//                     // })
//                 }
//             })
//         }else{
//             res.json({
//                 message: null
//             })
//             // res.json({
//             //     message: "No users found"
//             // })

//         }
//     })
// })

// // router.post('/login', async (req, res) => {

// //     const user = users.find((users) => users.email === req.body.email)
// //     if(user == null) {
// //         return res.setStatus(400).send('Cannot find user')
// //     }
// //     try {
// //         if(await bcrypt.compare(req.body.password, user.password)){
// //             res.send('Success')
// //         }
// //         else{
// //             res.send('Not allowed')
// //         }
// //     }
// //     catch(err) {
// //         res.status(500).send()
// //     }
// // })




// router.get('/get/:id', async (req, res) => {
//     let id = req.params.id;
//     User.findById(id, function (err, users) {
//         res.json(users);
//     })
// })

// module.exports = router



// /*


// router.post('/login', async (req, res) => {
//     var email = req.body.email;
//     var password = req.body.password;

//     User.findOne({ email: email})
//     .then((users) => {
//         if(users){
//             bcrypt.compare(password, users.password, function (err, result) {
//                 if(err){
//                     res.json({
//                         error: err
//                     })
//                 }
//                 if(result){
//                     let token = jwt.sign({email: users.email}, 'verySecretValue', {expiresIn:'1h'})
//                     res.json({
//                         message: "Login successful!",
//                         token: token
//                     })
//                 }else{
//                     res.json({
//                         message: "Password did not match"
//                     })
//                 }
//             })
//         }else{
//             res.json({
//                 message: "No users found"
//             })

//         }
//     })
// })

// */

module.exports = router
