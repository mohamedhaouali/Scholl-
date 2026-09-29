// import mongoose module
const mongoose = require("mongoose");

//create parent schema (representation of parent object in DB)
const parentSchema = mongoose.Schema({
    firstName : String,
    lastName : Number,
    email : String,
    phone : Number,  
    adresse: String   
                      
});

//affect Parent name to parent schema
const parent = mongoose.model("Parent",parentSchema);
module.exports = parent;