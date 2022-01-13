const mongoose = require('mongoose')
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// REGISTER
const signupUser = async (req, res) => {
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


        // console.log(token);

    } 
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


//LOGIN
const login = async (req, res) => {
    try{

        // VALIDATE
        const {email, password} = req.body;

        if(!email || !password)
            return res
            .status(400)
            .json({errorMessage: 'Please enter required credentials'});

        const existingUser = await User.findOne({email});
        if(!existingUser)
            return res.status(401).send('Wrong email or password');

        const passwordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!passwordCorrect)
            return res.status(401).send('Wrong email or password');

        // If user is blocked by admin
        User.findOne({
            _id: existingUser._id,
            blockedById: {$ne: []}
        })
        .then((isBlocked) => {
            if(isBlocked){
                return res.status(401).send('Your profile is blocked by the admins');
            }
            else{
                // Sign the token
                const token = jwt.sign({user: existingUser._id}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1 day'});

                // Send the token in a HTTP only cookie
                res.cookie("token", token, {httpOnly: true}).send();


                // console.log(token);
            }
        })


        

    } 
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

//LOGOUT

const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    }).send();
};


const checkIfLoggedIn = (req, res) => {
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
};

const checkIfAdmin = (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.json(false);
        
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!verified) return res.json(false);

        const decodedToken = jwt.decode(token, {
         complete: true
        });
        
        if (!decodedToken) {
         throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `provided token does not decode as JWT`);
        }

        const userId = mongoose.Types.ObjectId(decodedToken.payload.user)

        User.findOne({_id: userId, isAdmin: true})
        .then((isAdmin) => {
            if(isAdmin){
                res.send(true);
            }
            else{
                res.send(false);
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send(false);
    }
};


const getUsername = async (req, res) => {
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
}


// const getAllUserDetails = async (req, res) => {
//     try {
//         await User.find({}, {
//             fullName:1,
//             email:1,
//             Class:1,
//             branch:1,
//             isAdmin:1
//         })
//         .then((users) => {
//             if(users){
//                 res.json(users);
//             }
//             else{
//                 res.json(null);
//             }
//         })
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// }


const getAllUserDetails = async (req, res) => {
    try {
        await User.aggregate([
            {
                $project:
                {
                    fullName:1,
                    email:1,
                    Class:1,
                    branch:1,
                    isAdmin:1,
                    blocked: {
                        $size: "$blockedById"
                    }
                }
            }
        ])
        .then((users) => {
            if(users){
                res.json(users);
            }
            else{
                res.json(null);
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}



const getUserDetailsForUpdate = async(req, res) => {
    try {
        await User.findOne({
            _id: req.user
            },
            {
                isAdmin: 0
            }
        )
        .then((users) => {
            if(users){
                res.json(users);
            }
            else{
                res.json(null);
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const getAllAdminDetails = async (req, res) => {
    try {
        await User.find({"isAdmin" : true}, {
            fullName:1,
            email:1,
            Class:1,
            branch:1,
            isAdmin:1
        })
        .then((users) => {
            if(users){
                res.json(users);
            }
            else{
                res.json(null);
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const makeUserAdmin = async (req, res) => {
    try {

        let userId = mongoose.Types.ObjectId(req.params.id)

        await User.findOneAndUpdate(
            {
                _id: userId
            }, 
            {
                $set: {"isAdmin": true}
            }
        )
        .then((users) => {
            if(users){
                res.send("Made Admin successfully");
            }
            else{
                res.send("Didint make admin");
            }
        })  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const removeUserFromAdmin = async (req, res) => {
    try {

        let userId = mongoose.Types.ObjectId(req.params.id)

        await User.findOneAndUpdate(
            {
                _id: userId
            }, 
            {
                $set: {"isAdmin": false}
            }
        )
        .then((users) => {
            if(users){
                res.send("Removed Admin successfully");
            }
            else{
                res.send("Didint remove admin");
            }
        })  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const getAllBlockedUserDetails = async (req, res) => {
    try {
        User.aggregate([ 
            {
                $match: 
                {
                    "blockedById": {$ne: []}
                }
            },
            
            {
                $lookup: 
                {
                    from: "users", 
                    localField: "blockedById", 
                    foreignField: "_id",
                    as: "detail_of_remover"
                }
            },
            {$unwind: "$detail_of_remover"},
    
            {
                $project:
                {
                    fullName: 1,
                    email: 1,
                    Class: 1,
                    branch: 1,
                    nameOfBlocker: "$detail_of_remover.fullName",
                    blockerClass:  "$detail_of_remover.Class",
                    blockerBranch: "$detail_of_remover.branch"
                }
            }
        ])
        .then((answers) => 
        {
            if(answers){
                res.json(answers);
            }
            else {
                res.json({answers: null});
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const getAllMeBlockedUserDetails = async(req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user)
        User.aggregate([ 
            {
                $match: 
                {
                    "blockedById": userId
                }
            },
    
            {
                $project:
                {
                    fullName: 1,
                    email: 1,
                    Class: 1,
                    branch: 1
                }
            }
        ])
        .then((answers) => 
        {
            if(answers){
                res.json(answers);
            }
            else {
                res.json({answers: null});
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const blockUserByAdmin = async(req, res) => {
    try {
        let userId = mongoose.Types.ObjectId(req.params.id)
        let adminId = mongoose.Types.ObjectId(req.user)
    
        await User.findOneAndUpdate(
            {
                _id: userId
            }, 
            {
                $addToSet: 
                {
                    blockedById: adminId
                }
            }
        )
        .then((answers) => {
            if(answers){
                res.send("Blocked user successfully");
            }
            else{
                res.send("Didn't block user");
            }
        })  
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const unblockAnyUserByAdmin = async (req, res) => {
    try {
        let userId = mongoose.Types.ObjectId(req.params.id)
        let adminId = mongoose.Types.ObjectId(req.user)
    
        await User.findOneAndUpdate(
            {
                _id: userId
            }, 
            {
                $set: 
                {
                    blockedById: []
                }
            }
        )
        .then((answers) => {
            if(answers){
                res.send("Unblocked user successfully");
            }
            else{
                res.send("Didn't Unblocked user");
            }
        })  
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const unblockMyBlockedUserByAdmin = async (req, res) => {
    try {
        let userId = mongoose.Types.ObjectId(req.params.id)
        let adminId = mongoose.Types.ObjectId(req.user)
    
        await User.findOneAndUpdate(
            {
                _id: userId
            }, 
            {
                $set: 
                {
                    blockedById: []
                }
            }
        )
        .then((answers) => {
            if(answers){
                res.send("Unblocked user successfully");
            }
            else{
                res.send("Didn't Unblocked user");
            }
        })  
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


module.exports = userController = {
    signupUser,
    login, logout,
    checkIfLoggedIn,
    getUsername,
    checkIfAdmin,
    getAllUserDetails,
    getAllAdminDetails,
    makeUserAdmin,
    removeUserFromAdmin,
    getUserDetailsForUpdate,

    getAllBlockedUserDetails,
    getAllMeBlockedUserDetails,
    blockUserByAdmin,
    unblockAnyUserByAdmin,
    unblockMyBlockedUserByAdmin
};


//status 400: error from frontend(bad request, invalid input)
//status 500: error in server
//status 401: Unauthorized