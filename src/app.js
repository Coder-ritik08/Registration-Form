require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
require("./db/conn");
const Register = require("./models/user_register");

// Port no.
const port = process.env.port ;

console.log(process.env.secret_key);

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
app.use(express.urlencoded({extended:false}));

app.get("",(req,res)=>{
    res.render("index")
});
app.get("/register",(req,res)=>{
    res.render("registration")
});
app.get("/login",(req,res)=>{
    res.render("login")
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
        // console.log("token is " + token);

    }catch(error){
        res.status(400).send(error);
    }
});
app.post("/login",async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email});
        const checkpassword = await bcrypt.compare(password,useremail.password);
        const token = await useremail.generatetoken();
        console.log(token);

        if(checkpassword){
            res.status(201).render("index");
        }else{
            res.send("invalid password")
        }

    }catch(error){
        res.status(400).send(error);
    }
})
app.get("*",(req,res)=>{
    res.render("404")
});
app.listen(port,()=>{
    console.log(`working on the port no. ${port}`)
})