// import mongoose module
const mongoose = require("mongoose");

//create classet schema (representation of classe object in DB)
const classeSchema = mongoose.Schema({
name : String,
 //  va contenir une valeur d'un _id
 tId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
 
    },
    
     //  va contenir une valeur d'un _id
 courId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Cour'
 
    } 
});

//affect Student name to student schema
const classe = mongoose.model("Classe",classeSchema);
module.exports = classe;