const jwt = require('jsonwebtoken');


function auth(req, res, next) {
    try {
        const token = req.cookies.token;
        //if(!token) return res.status(401).json({errorMessage: "Unauthorized"});
        if(!token) return res.status(401).send("Unauthorized");

        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified.user; //will store user ID

        next();
    }
    catch (err) {
        console.error(err);
        //res.status(401).json({errorMessage: "Unauthorized"});
        res.status(401).send("Unauthorized");
    }
}

module.exports = auth;