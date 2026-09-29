// import mongoose module
const mongoose = require("mongoose");

//create evaluation schema (representation of evaluation object in DB)
const evaluationSchema = mongoose.Schema({
    evaluation : String,
    note : Number,
    //  va contenir une valeur d'un _id
 tId: {
        type: mongoose.Schema .Types.ObjectId,
        ref: 'Cour',
      
    },

 studentId: {
        type: mongoose.Schema .Types.ObjectId,
        ref: 'User',
      
    },   
                         
});

//affect Evaluation name to evaluation schema
const evaluation = mongoose.model("Evaluation",evaluationSchema);
module.exports = evaluation;

