// import mongoose module
const mongoose = require("mongoose");

//create teacher schema (representation of teacher object in DB)
const teacherSchema = mongoose.Schema({
    firstName : String,
    lastName : Number,
    specialite : Number,
    email : String,
    phone : Number,
    adresse: String  
                     
});

//affect Teacher name to teacher schema
const teacher = mongoose.model("Teacher",teacherSchema);
module.exports = teacher;