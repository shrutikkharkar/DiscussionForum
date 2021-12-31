const jwt = require('jsonwebtoken');
const User = require('../models/User.model')
const mongoose = require('mongoose')

function adminAuth(req, res, next) {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).send("Unauthorized");

        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!verified) return res.status(401).send("Unauthorized")

        req.user = verified.user;

        User.findOne({_id: mongoose.Types.ObjectId(req.user), isAdmin: true})
        .then((isAdmin) => {
            if(isAdmin){
                req.user = verified.user;
                next();
            }
            else{
                res.status(401).send("Unauthorized");
            }
        })    
    }
    catch (err) {
        console.error(err);
        res.status(401).send("Unauthorized");
    }
}

module.exports = adminAuth;