require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Register = require("./models/user_register");

// Port no.
const port = process.env.port ;

// static path
const staticPath = path.join(__dirname, "../public")
const TemplatePath = path.join(__dirname, "../templates/views")
const PartialsPath = path.join(__dirname, "../templates/partials")

// template engine
app.use(express.static(staticPath));
app.set("view engine" , "hbs"); 

// views folder set
app.set("views",TemplatePath);
hbs.registerPartials(PartialsPath);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.get("",(req,res)=>{
    res.render("index")
});
app.get("/register",(req,res)=>{
    res.render("registration")
});

app.post("/register",async(req,res)=>{
    try{
        const registerUser = new Register({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            gender : req.body.gender,
            phone : req.body.phone,
            email : req.body.email,
            password : req.body.password
        })
        const token = await registerUser.generatetoken();
        await registerUser.save();
        res.status(201).render("index");
        const cookie = res.cookie("jwt",token,{
            expires: new Date(Date.now() + 50000),
            httpOnly:true,
            // secure:true
        });
        // console.log(cookie);

    }catch(error){
        res.status(400).send(error);
    }
});

app.get("/login",(req,res)=>{
    res.render("login")
});

app.post("/login",async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email});
        const checkpassword = await bcrypt.compare(password,useremail.password);
        const token = await useremail.generatetoken();
        const cookie = res.cookie("jwt",token,{
            expires: new Date(Date.now() + 50000),
            // httpOnly:true,
            // secure: true
        });
        // console.log(cookie);

        if(checkpassword){
            res.status(201).render("index");
        }else{
            res.send("invalid password")
        }

    }catch(error){
        res.status(400).send(error);
    }
});

app.get("/secret",auth,(req,res)=>{
    res.render("secret");
    // console.log(req.cookies.jwt);
});

app.get("/logout",auth,async(req,res)=>{
    try {
        // logout from single device
        req.user.token = req.user.token.filter((currentToken)=>{
            return currentToken.token === req.token
        })
        // logout from all devices
        // req.user.token = [];

        res.clearCookie("jwt");
        console.log("Logout Sucessfully");     

        res.render("logout");
        res.send("Logout Sucessfully");
        await req.user.save();
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("*",(req,res)=>{
    res.render("404")
});

app.listen(port,()=>{
    console.log(`working on the port no. ${port}`)
})