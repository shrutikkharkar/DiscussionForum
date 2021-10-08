const jwt = require("jsonwebtoken");
exports.createJWT = (email, password, duration) => {
   const payload = {
      email,
      password,
      duration
   };
   return jwt.sign(payload, process.env.TOKEN_SECRET, {
     expiresIn: duration,
   });
};