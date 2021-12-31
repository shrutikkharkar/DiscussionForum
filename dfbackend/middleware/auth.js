const jwt = require('jsonwebtoken');
const User = require('../models/User.model')

function auth(req, res, next) {
    try {
        const token = req.cookies.token;
        //if(!token) return res.status(401).json({errorMessage: "Unauthorized"});
        if(!token) return res.status(401).send("Unauthorized");

        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified.user; //will store user ID

        User.findOne({
            _id: req.user,
            blockedById: {$ne: []}
        })
        .then((isBlocked) => {
            if(isBlocked){
                return res.status(401).cookie("token", "", {
                    httpOnly: true,
                    expires: new Date(0)
                }).send('Your profile is blocked by the admins');  
            }
            else{
                const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                req.user = verified.user; //will store user ID
                next();
            }
        })

        
    }
    catch (err) {
        console.error(err);
        res.status(401).send("Unauthorized");
    }
}

module.exports = auth;