const jwt = require("jsonwebtoken");
const Register = require("../models/user_register");


const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.secert_key, function(err) {
            if (err) {
                err = {
                  name: 'JsonWebTokenError',
                  message: 'jwt malformed'
                }
            }
          });
        const decoded = jwt.decode(token);
        const User = await Register.findOne({_id:decoded._id});
        console.log(decoded);
        console.log(User)
        req.token = token;
        req.User = User;
        next();

    } catch (error) {
        res.status(401).send(error);
        console.log(error);
    }
}

module.exports = auth;