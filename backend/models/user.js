// import mongoose module
const mongoose = require("mongoose");

//create user schema (representation of user object in DB)
const userSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email: String,
    pwd: String,
    adress: String,
    phone: Number,
    role: String,
    photo: String,
    specialite: String,
    cv: String,   // 🆕 nom du fichier PDF du CV (teachers)

    

  // Champ ajouté pour la validation des enseignants par l'Admin
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' // Tout nouveau compte commence "En attente"
    },

        //  va contenir une liste d'un _id du model player
    //du type ObjectId
    //players List = [17,6,1,99,87]
 teachersList: [
    {
        type: mongoose.Schema .Types.ObjectId,
        ref: 'Cour',
        }
       
    ] ,

 studentsList: [
    {
        type: mongoose.Schema .Types.ObjectId,
        ref: 'Evaluation',
        }
       
    ] ,
    
  classesList: [
    {
        type: mongoose.Schema .Types.ObjectId,
        ref: 'Classe',
        }
       
    ] ,    


});

const user = mongoose.model("User",userSchema);
module.exports = user;