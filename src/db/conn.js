const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/RegistationForm",{useNewUrlParser: true},()=>{
    console.log("Connect to the DataBase Succesfully :)")});
mongoose.set("strictQuery", true);