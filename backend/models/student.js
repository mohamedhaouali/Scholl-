// import mongoose module
const mongoose = require("mongoose");

//create student schema (representation of student object in DB)
const studentSchema = mongoose.Schema({
    firstName : String,
    lastName : Number,
    email : String,
    phone : Number,  
   adress: String,

                      
});

//affect Student name to student schema
const student = mongoose.model("Student",studentSchema);
module.exports = student;