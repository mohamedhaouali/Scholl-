// import mongoose module
const mongoose = require("mongoose");

const courSchema = new mongoose.Schema({
    name: String,
    duree: Number,
    description: String,
  
    // ID de l'enseignant associé à ce cours (Relation One-to-Many)
    tId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // 💡 Empêche la création d'un cours "orphelin" sans professeur
    },

     evaluationsList: [
    {
        type: mongoose.Schema .Types.ObjectId,
        ref: 'Evaluation',
        }
       
    ] ,

     coursList: [
    {
        type: mongoose.Schema .Types.ObjectId,
        ref: 'Classe',
        }
       
    ] ,
});

// affect Cour name to cour schema
const cour = mongoose.model("Cour", courSchema);

// export modules
module.exports = cour;
