const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    tokens : [{
        token:{
        type : String,
        required : true
        }
    }]
});

UserSchema.methods.generatetoken = async function(){
try {
    const token = jwt.sign({_id:this._id.toString()},"process.env.secret_key");
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token
} catch (error) {
    res.send("error part" + error);
    console.log("error part" + error);
}
}

UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const Register = new mongoose.model("RegistationForm", UserSchema);
module.exports = Register;