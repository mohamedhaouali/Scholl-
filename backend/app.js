//import express module
const express = require('express');

//Create an Express Application

const app = express();

//import cors module

const cors = require('cors');

// import mongoose module

const mongoose = require('mongoose');

//connex au bd 24 aout
mongoose.connect('mongodb://127.0.0.1:27017/SchollCroco')

//import bcrypt module (Crypting module)

const bcrypt = require("bcrypt");

//import multer module (for file upload file)

const multer = require("multer"); 
const path = require("path");

//import axios module (API communication)
const axios = require("axios");


//App Configuration
//Security config

app.use(cors());

//Send Json response

app.use(express.json());

//Get JSON object from Request

app.use(express.urlencoded({ extended: true }));

// images va remplacer backend/uploads
 app.use('/images', express.static(path.join('backend/uploads')));

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, "backend/uploads"); 
}, 
  filename: (req, file, cb) => { 
    cb(null, Date.now() + path.extname(file.originalname)); 
} 
});

//Models importation (DB)
const Cour = require ("./models/cour");
const Evaluation = require ("./models/evaluation");
const User = require ("./models/user");
const Classe = require("./models/classe");

//Business Logic : Add Cours

app.post("/cours", async (req, res) => {
    console.log("Données reçues du formulaire Angular :", req.body);

    try {
        // 1. Vérifier si l'enseignant existe
        const foundUser = await User.findById(req.body.tId);
        if (!foundUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        // 2. Création du cours avec les bonnes valeurs du formulaire
        const cour = new Cour({
            name: req.body.name,               // Vérifiez que le champ s'appelle bien 'name' dans votre HTML/TS Angular
            duree: req.body.duree,             // Vérifiez que le champ s'appelle bien 'duree' dans votre HTML/TS Angular
            description: req.body.description, // Vérifiez que le champ s'appelle bien 'description' dans votre HTML/TS Angular
            tId: req.body.tId 
        });

        // 3. Sauvegarde en Base de Données
        const savedCour = await cour.save();
        console.log("Cours enregistré avec succès :", savedCour);

        // 4. Liaison avec la liste de l'enseignant
        foundUser.teachersList.push(savedCour._id);
        await foundUser.save();

        return res.status(201).json({ msg: "Cour added with success" });

    } catch (err) {
        console.error("Erreur serveur lors de l'ajout du cours :", err);
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});


app.get("/cours", (req, res) => {
    console.log("Business Logic : Get ALL Cours");
    
    Cour.find().populate('tId') // 🟢 Remplace l'ID de l'enseignant par l'objet User complet

        .then((docs) => {
            console.log("Here is all objects from cours collection", docs);
            
            // On renvoie un objet avec la propriété 'tab' attendue par Angular
            res.status(200).json({ tab: docs });
        })
        .catch((err) => {
            console.error("Erreur lors de la récupération des cours :", err);
            res.status(500).json({ msg: "Erreur serveur", error: err.message });
        });
});


//Business Logic : Edit cours
app.put("/cours",(req, res) => { 
    console.log("Business Logic : Edit cours");
    // Get object from request
    //object contains ID and new values
    let newCour = req.body; // req.body = {id:3,scoreOne:newvalue,scoreTwo:newvalue,teamOne :newvalue,
    // teamTwo:newvalue}
    Cour.updateOne({_id: req.body._id},newCour).then(
        (updateRes) => {
            console.log("Here is update response",updateRes);
            if(updateRes.nModified == 1){
                res.json({msg: "Edited with success"});
            } else {
               res.json({ msg: "Cour not Edited" }); 
            }
            
        }
    )
    
});

//Business Logic : Get Cour By id
// :id :m'id est une parametre (variable)
// Business Logic : Get Cour By id
app.get("/cours/:id", (req, res) => {
    Cour.findById(req.params.id)
        .populate("tId", "firstName lastName email photo specialite") // pas de pwd
        .then((doc) => {
            if (!doc) return res.status(404).json({ error: "Cours introuvable" });
            res.json({ cour: doc });
        })
        .catch((err) => {
            console.error("Error fetching course:", err);
            res.status(500).json({ error: err.message });
        });
});

// Récupérer tous les cours d'un teacher donné
app.get("/cours/teacher/:id", (req, res) => {
    let teacherId = req.params.id;
    console.log("Business Logic : Get Cours By Teacher ID", teacherId);

    Cour.find({ tId: teacherId })
        .populate("tId", "firstName lastName email specialite photo")
        .then((cours) => {
            res.status(200).json({ tab: cours });
        })
        .catch((err) => {
            console.error("Erreur lors de la recherche :", err);
            res.status(500).json({ error: "Erreur serveur" });
        });
});

//Business Logic : DELETE Teacher By id
app.delete("/cours/:id",(req, res) => {
    console.log("Business Logic : Delete cour By ID ");
    let courId= req.params.id;
     Cour.deleteOne({ _id: courId }).then(
     (deleteRes)=>{
        console.log("Here is deleteRes ",deleteRes);
        if(deleteRes.deletedCount == 1 ){
            res.json({msg: "Deleted with success"});

        } else {
            res.json({msg: "Cour Not found"});
        }
     }

    )
    

    });


// !!! DÉCLARATION DE LA VARIABLE GLOBALE UPLOAD !!!
const upload = multer({ storage: storageConfig }); 
const fs = require("fs");

// dossier des CV (créé automatiquement s'il n'existe pas)
fs.mkdirSync("backend/uploads/cv", { recursive: true });

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "backend/uploads/cv"),
  filename: (req, file, cb) => {
    cb(null, "cv-" + Date.now() + "-" + Math.round(Math.random() * 1e6) + ".pdf");
  }
});

const uploadCv = multer({
  storage: cvStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Seuls les fichiers PDF sont acceptés"));
    }
    cb(null, true);
  }
});

// supprime un fichier uploadé en cas d'erreur
const removeFile = (file) => {
  if (file) fs.unlink(file.path, () => {});
};

// rend les CV accessibles via http://localhost:3000/cv/nom-du-fichier.pdf
app.use("/cv", express.static(path.join("backend/uploads/cv")));

// Business Logic : Get All Students

app.get("/users/students", (req, res) => {
    console.log("Business Logic : Get All Students");

    // On cherche les utilisateurs ayant le rôle "student"
    User.find({ role: "student" })
        .select("-pwd") // 🆕 ne pas envoyer les mots de passe hachés
        .populate({
            path: "classesList",          // 🆕 le vrai champ du schéma User
            populate: {
                path: "courId",           // 🆕 le cours de chaque classe
                populate: {
                    path: "tId",          // l'enseignant du cours
                    select: "firstName lastName email photo specialite"
                }
            }
        })
        .then((docs) => {
            res.status(200).json({ tab: docs });
        })
        .catch((err) => {
            console.error("Erreur Mongoose :", err);
            res.status(500).json({ msg: "Erreur interne", error: err.message });
        });
});

app.get("/users/students/:id", (req, res) => {
    let userId = req.params.id;
    console.log("Business Logic : Get Student By ID", userId);

    User.findOne({ _id: userId, role: "student" })
        .populate({
            path: "classesList",
            populate: {
                path: "courId",
                populate: {
                    path: "tId",
                    select: "firstName lastName email photo specialite"
                }
            }
        })
        .then((doc) => {
            if (!doc) {
                return res.status(404).json({ message: "Étudiant non trouvé" });
            }
            console.log("Here is doc from users collection", doc);
            res.status(200).json({ user: doc });
        })
        .catch((err) => {
            console.error("Erreur lors de la recherche :", err);
            res.status(500).json({ error: "Erreur serveur" });
        });
});

//Business Logic : Add Signup
app.post("/users/students", upload.single('img'), (req, res) => {
    console.log("Business Logic : Signup", req.body);

    // 💡 SÉCURITÉ : On vérifie si req.body ou req.body.email est manquant
    if (!req.body || !req.body.email) {
        return res.status(400).json({ msg: "Le champ email est obligatoire ou la requête est vide." });
    }
    
    if (!req.body.pwd) {
        return res.status(400).json({ msg: "Le champ mot de passe (pwd) est obligatoire." });
    }

   // search user by email
   User.findOne({ email: req.body.email }).then(
   (doc) => {
    //doc: un objet user ou null
    console.log("Here is doc from users collection", doc);
    if (doc) {
        res.json({msg:"Email already exists"});

    } else {
        bcrypt.hash(req.body.pwd , 8).then (
            (cryptedPwd) => {
                console.log("Here is crypted pwd", cryptedPwd);
                req.body.pwd = cryptedPwd;
             
               let user = new User({
                       firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        pwd: cryptedPwd,
                        adress: req.body.adress,
                        phone: req.body.phone,
                        role: "student",
                        status: "approved", // Alignement avec le status positionné par Angular
                courId: req.body.courId, // ✅ FIX : Capture et enregistrement du cours sélectionné !
                        photo: req.file ? req.file.filename : req.body.photo, 
                        
                       
                    });
                
                // 💡 ATTENTION : .save() est asynchrone, il vaut mieux renvoyer la réponse APRÈS la sauvegarde réussie
                user.save()
                    .then(() => {
                        res.json({msg: "User added with success"});
                    })
                    .catch((err) => {
                        console.error("Erreur lors de la sauvegarde :", err);
                        res.status(500).json({msg: "Erreur lors de la création de l'utilisateur"});
                    });
            }
        ).catch(err => {
            res.status(500).json({msg: "Erreur de hachage", error: err});
        });
    }
   }
   ).catch(err => {
       res.status(500).json({msg: "Erreur de base de données", error: err});
   });
});

//Business Logic : Get students By id
// :id :m'id est une parametre (variable)


app.get("/users/students/:id", (req, res) => {
    let userId = req.params.id; // Récupère l'ID passé dans l'URL
    console.log("Business Logic : Get Parent By ID", userId);

    // 1. Utilisation de la bonne méthode et correction de la syntaxe
    User.findById({ _id: userId, role: "student" })
        .then((doc) => {
            if (!doc) {
                // 2. Gestion du cas où aucun parent n'est trouvé avec cet ID
                return res.status(404).json({ message: "Parent non trouvé" });
            }
            console.log("Here is doc from users collection", doc);
            res.status(200).json({ user: doc });
        })
        .catch((err) => {
            // 3. Gestion des erreurs (ex: format d'ID invalide)
            console.error("Erreur lors de la recherche :", err);
            res.status(500).json({ error: "Erreur serveur" });
        });
});

app.delete("/users/students/:id", (req, res) => {
    
    let userId = req.params.id;
    console.log("Business Logic : Delete student By ID ", userId);
    User.deleteOne({_id: userId, role: "student"}).then(
     (deleteRes)=>{
        console.log("Here is deleteRes ",deleteRes);
        if(deleteRes.deletedCount == 1 ){
            res.json({msg: "Deleted with success"});

        } else {
            res.json({msg: "student Not found"});
        }
     }

    )

});

// Business Logic : Edit Student (Mise à jour avec Photo)
app.put("/users/students", upload.single("photo"), async (req, res) => {
    console.log("Business Logic : Edit Student Backend");
    console.log("Données textuelles reçues :", req.body);
    console.log("Fichier photo reçu :", req.file);

    try {
        const studentId = req.body._id;
        if (!studentId) {
            return res.status(400).json({ msg: "Student ID is required" });
        }

        // 1. Préparation de l'objet contenant les modifications textuelles
        let updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            adress: req.body.adress
        };

        // 2. Si l'utilisateur a choisi une nouvelle photo dans Angular
        if (req.file) {
            // On stocke le nom unique du fichier généré par Multer (ex: 171829381.jpg)
            updateData.photo = req.file.filename;
        }

        // 3. Mise à jour dans MongoDB via Mongoose
        const updateRes = await User.updateOne(
            { _id: studentId, role: "student" },
            { $set: updateData }
        );

        console.log("Réponse Mongoose Update :", updateRes);

        // 4. Vérification du succès de l'opération
        // matchedCount ou nModified selon la version de Mongoose
        if (updateRes.matchedCount === 1 || updateRes.nModified === 1) {
            return res.status(200).json({ msg: "Edited with success" });
        } else {
            return res.json({ msg: "Student not Edited" });
        }

    } catch (err) {
        console.error("Erreur serveur lors de la modification de l'étudiant :", err);
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});



//Business Logic : Add Signup
app.post("/users/teachers", uploadCv.single("cv"), (req, res) => {
    console.log("Business Logic : Signup", req.body, req.file);

    if (!req.body || !req.body.email) {
        removeFile(req.file);
        return res.status(400).json({ msg: "Le champ email est obligatoire ou la requête est vide." });
    }

    if (!req.body.pwd) {
        removeFile(req.file);
        return res.status(400).json({ msg: "Le champ mot de passe (pwd) est obligatoire." });
    }

    if (!req.file) {
        return res.status(400).json({ msg: "Le CV (PDF) est obligatoire." });
    }

    User.findOne({ email: req.body.email }).then((doc) => {
        if (doc) {
            removeFile(req.file);
            return res.json({ msg: "Email already exists" });
        }

        bcrypt.hash(req.body.pwd, 8).then((cryptedPwd) => {
            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                pwd: cryptedPwd,
                adress: req.body.adress,
                phone: req.body.phone,
                specialite: req.body.specialite,
                role: "teacher",
                status: "pending",          // 🆕 validation par l'admin
                cv: req.file.filename       // 🆕 nom du PDF enregistré
            });

            user.save()
                .then(() => {
                    res.json({ msg: "User added with success" });
                })
                .catch((err) => {
                    console.error("Erreur lors de la sauvegarde :", err);
                    removeFile(req.file);
                    res.status(500).json({ msg: "Erreur lors de la création de l'utilisateur" });
                });
        }).catch((err) => {
            removeFile(req.file);
            res.status(500).json({ msg: "Erreur de hachage", error: err });
        });
    }).catch((err) => {
        removeFile(req.file);
        res.status(500).json({ msg: "Erreur de base de données", error: err });
    });
});



app.get("/users/teachers", (req, res) => {
    console.log("Business Logic : Get ALL teachers");
    
    User.find({ role: "teacher" })
        .then((docs) => {
            // docs : tableau d'objets récupérés de la collection 'users'
            console.log("Here is all objects from users collection", docs);
            res.status(200).json({ tab: docs });
        })
        .catch((err) => {
            // Sécurité : empêche le serveur de planter en cas de problème de base de données
            console.error("Erreur lors de la récupération des parents :", err);
            res.status(500).json({ error: "Erreur serveur lors de la récupération des données" });
        });
});

app.get("/users/teachers/:id", (req, res) => {
    let userId = req.params.id; // Récupère l'ID passé dans l'URL
    console.log("Business Logic : Get teacher By ID", userId);

    // 1. Utilisation de la bonne méthode et correction de la syntaxe
    User.findById({ _id: userId, role: "teacher" })
        .then((doc) => {
            if (!doc) {
                // 2. Gestion du cas où aucun parent n'est trouvé avec cet ID
                return res.status(404).json({ message: "teacher non trouvé" });
            }
            console.log("Here is doc from users collection", doc);
            res.status(200).json({ user: doc });
        })
        .catch((err) => {
            // 3. Gestion des erreurs (ex: format d'ID invalide)
            console.error("Erreur lors de la recherche :", err);
            res.status(500).json({ error: "Erreur serveur" });
        });
});

//Business Logic : DELETE MATCH By id
app.delete("/users/teachers/:id", (req, res) => {
    
    let userId = req.params.id;
    console.log("Business Logic : Delete teacher By ID ", userId);
    User.deleteOne({_id: userId, role: "teacher"}).then(
     (deleteRes)=>{
        console.log("Here is deleteRes ",deleteRes);
        if(deleteRes.deletedCount == 1 ){
            res.json({msg: "Deleted with success"});

        } else {
            res.json({msg: "teacher Not found"});
        }
     }

    )

});

app.put("/users/teachers", (req, res) => {
    console.log("Business Logic : Edit teacher");
    // Get object from request
    //object contains ID and new values
    let newUser = req.body; // req.body = {id:3,scoreOne:newvalue,scoreTwo:newvalue,teamOne :newvalue,
    // teamTwo:newvalue}
    User.updateOne({_id: req.body._id},newUser).then(
        (updateRes) => {
            console.log("Here is update response",updateRes);
            if(updateRes.nModified == 1){
                res.json({msg: "Edited with success"});
            } else {
               res.json({ msg: "teacher not Edited" }); 
            }
            
        }
    )
 
});



//Business Logic : Search teachers By specialite


app.get("/users/teachers/search/:specialite", (req, res) => {
    console.log("Business Logic : Search teachers By specialite");

    // ✅ FIX 1 : Récupération depuis les paramètres d'URL (req.params) et non le body
    let specialiteParam = req.params.specialite;

    if (!specialiteParam) {
        return res.json({ msg: "No teachers found", teachers: [] });
    }

    // ✅ FIX 2 : Requête directe dans MongoDB avec Mongoose
    // Utilisation d'une expression régulière pour ignorer les majuscules/minuscules (ex: 'Math' ou 'math')
    User.find({
        role: "teacher",
        specialite: { $regex: new RegExp("^" + specialiteParam.trim() + "$", "i") }
    })
    .then((foundTeachers) => {
        console.log("Enseignants trouvés :", foundTeachers.length);

        if (foundTeachers.length > 0) {
            // Renvoie le tableau sous la clé 'teachers' attendue par votre Angular
            res.json({ teachers: foundTeachers });
        } else {
            // ✅ Toujours renvoyer un tableau vide pour éviter les crashs côté Angular
            res.json({ msg: "No teachers found", teachers: [] });
        }
    })
    .catch((err) => {
        console.error("Erreur MongoDB :", err.message);
        res.status(500).json({ msg: "Erreur serveur", teachers: [] });
    });
});



//Business Logic : Add Signup
app.post("/users/parents", (req, res) => {
    console.log("Business Logic : Signup", req.body);

    // 💡 SÉCURITÉ : On vérifie si req.body ou req.body.email est manquant
    if (!req.body || !req.body.email) {
        return res.status(400).json({ msg: "Le champ email est obligatoire ou la requête est vide." });
    }
    
    if (!req.body.pwd) {
        return res.status(400).json({ msg: "Le champ mot de passe (pwd) est obligatoire." });
    }

   // search user by email
   User.findOne({ email: req.body.email }).then(
   (doc) => {
    //doc: un objet user ou null
    console.log("Here is doc from users collection", doc);
    if (doc) {
        res.json({msg:"Email already exists"});

    } else {
        bcrypt.hash(req.body.pwd , 8).then (
            (cryptedPwd) => {
                console.log("Here is crypted pwd", cryptedPwd);
                req.body.pwd = cryptedPwd;

   
               let user = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        pwd: cryptedPwd,
                        adress: req.body.adress,
                        phone: req.body.phone,
                        role: "parent",
                    });
                
                // 💡 ATTENTION : .save() est asynchrone, il vaut mieux renvoyer la réponse APRÈS la sauvegarde réussie
                user.save()
                    .then(() => {
                        res.json({msg: "Parent added with success"});
                    })
                    .catch((err) => {
                        console.error("Erreur lors de la sauvegarde :", err);
                        res.status(500).json({msg: "Erreur lors de la création de l'utilisateur"});
                    });
            }
        ).catch(err => {
            res.status(500).json({msg: "Erreur de hachage", error: err});
        });
    }
   }
   ).catch(err => {
       res.status(500).json({msg: "Erreur de base de données", error: err});
   });
});

//Business Logic : Get MATCH By id
// :id :m'id est une parametre (variable)


app.get("/users/parents/:id", (req, res) => {
    let userId = req.params.id; // Récupère l'ID passé dans l'URL
    console.log("Business Logic : Get Parent By ID", userId);

    // 1. Utilisation de la bonne méthode et correction de la syntaxe
    User.findById({ _id: userId, role: "parent" })
        .then((doc) => {
            if (!doc) {
                // 2. Gestion du cas où aucun parent n'est trouvé avec cet ID
                return res.status(404).json({ message: "Parent non trouvé" });
            }
            console.log("Here is doc from users collection", doc);
            res.status(200).json({ user: doc });
        })
        .catch((err) => {
            // 3. Gestion des erreurs (ex: format d'ID invalide)
            console.error("Erreur lors de la recherche :", err);
            res.status(500).json({ error: "Erreur serveur" });
        });
});

app.get("/users/parents", (req, res) => {
    console.log("Business Logic : Get ALL Parents");
    
    User.find({ role: "parent" })
        .then((docs) => {
            // docs : tableau d'objets récupérés de la collection 'users'
            console.log("Here is all objects from users collection", docs);
            res.status(200).json({ tab: docs });
        })
        .catch((err) => {
            // Sécurité : empêche le serveur de planter en cas de problème de base de données
            console.error("Erreur lors de la récupération des parents :", err);
            res.status(500).json({ error: "Erreur serveur lors de la récupération des données" });
        });
});

//Business Logic : DELETE MATCH By id
app.delete("/users/parents/:id", (req, res) => {
    
    let userId = req.params.id;
    console.log("Business Logic : Delete Match By ID ", userId);
    User.deleteOne({_id: userId, role: "parent"}).then(
     (deleteRes)=>{
        console.log("Here is deleteRes ",deleteRes);
        if(deleteRes.deletedCount == 1 ){
            res.json({msg: "Deleted with success"});

        } else {
            res.json({msg: "Match Not found"});
        }
     }

    )

});

//Business Logic : Edit User

app.put("/users/parents", (req, res) => {
    console.log("Business Logic : Edit Parents");
    // Get object from request
    //object contains ID and new values
    let newUser = req.body; // req.body = {id:3,scoreOne:newvalue,scoreTwo:newvalue,teamOne :newvalue,
    // teamTwo:newvalue}
    User.updateOne({_id: req.body._id},newUser).then(
        (updateRes) => {
            console.log("Here is update response",updateRes);
            if(updateRes.nModified == 1){
                res.json({msg: "Edited with success"});
            } else {
               res.json({ msg: "Parent not Edited" }); 
            }
            
        }
    )
 
});



//Business Logic : Add Signup
app.post("/users",upload.single('img'), (req, res) => {
    console.log("Business Logic : Signup", req.body);
   // search user by email
   User.findOne({ email: req.body.email }) .then(
   (doc) => {
    //doc: un objet user ou null
    console.log("Here is doc from users collection", doc);
    if (doc) {
        res.json({msg:"Email already exists"});

    } else {
        bcrypt.hash(req.body.pwd , 8).then (
            (cryptedPwd) => {
                console.log("Here is crypted pwd,cryptedPwd");
                req.body.pwd = cryptedPwd;
// 3. Gestion du chemin de l'image (si un fichier a été téléversé)
                        if (req.file) {
                            req.body.photo = `http://localhost:3000/images/${req.file.filename}`;
                        } else {
                            req.body.photo = ""; // Valeur par défaut si aucune image
                        }


                let user = new User(req.body);
                user.save();
                res.json({msg: "User added with success"})

            }
        )

    }
   }
   )

});


//Business Logic : Add Login

app.post("/users/signin", (req, res) => {
    console.log("Business Logic : Login", req.body);
    
    // On cherche l'utilisateur (on peut chercher par String ou convertir si nécessaire)
    User.findOne({ phone: req.body.phone }).then(
        (foundUser) => {
            console.log("Here is found User ", foundUser);
            
            if (!foundUser) {
                return res.json({ msg: "Check Phone" });
            } else {
                bcrypt.compare(req.body.pwd, foundUser.pwd).then(
                    (pwdResult) => {
                        console.log("Here is pwdResult", pwdResult);
                        
                        if (pwdResult) {

                            // 🟢 FIX : .toLowerCase() permet d'accepter 'teacher' ou 'Teacher' sans distinction
                            if (foundUser.role && foundUser.role.toLowerCase() === "teacher") {
                                if (foundUser.status === "pending") {
                                    console.log("Accès bloqué : Enseignant en attente de validation.");
                                    return res.json({ msg: "Account pending validation" });
                                }
                                if (foundUser.status === "rejected") {
                                    console.log("Accès bloqué : Enseignant refusé.");
                                    return res.json({ msg: "Account rejected" });
                                }
                            }

                            // Connexion autorisée si approuvé ou s'il s'agit d'un autre rôle
                            let user = {
                                _id:      foundUser._id,
                                firstName: foundUser.firstName,
                                lastName: foundUser.lastName,
                                email:    foundUser.email,
                                role:     foundUser.role,
                                phone:    foundUser.phone,
                                adress:   foundUser.adress
                            };
                            
                            console.log("Connexion réussie pour :", user.email);
                            return res.json({ msg: "Login with success", user: user });

                        } else {
                            return res.json({ msg: "Password incorrect" });
                        }
                    }
                );
            }
        }
    ).catch(err => {
        console.error("Erreur de connexion :", err);
        res.status(500).json({ msg: "Internal server error" });
    });
});



// 🟢 Business Logic : Update Teacher Status (Valider / Rejeter)

app.patch("/users/teachers/:id/status", (req, res) => {
    const teacherId = req.params.id;
    const newStatus = req.body.status; // Reçoit 'approved' ou 'rejected' envoyé par Angular

    console.log(`Business Logic : Update Status pour l'ID ${teacherId} -> ${newStatus}`);

    // 1. Validation de sécurité sur la valeur du statut
    if (newStatus !== 'approved' && newStatus !== 'rejected') {
        return res.json({ msg: "Invalid status value" });
    }

    // 2. Recherche et mise à jour partielle dans la collection Users avec Mongoose
    User.findByIdAndUpdate(
        teacherId,
        { status: newStatus },
        { new: true } // Cette option permet de récupérer le document modifié dans le .then()
    )
    .then((updatedUser) => {
        if (!updatedUser) {
            console.log("Enseignant non trouvé en base de données.");
            return res.json({ msg: "Teacher not found" });
        }

        console.log("Statut mis à jour avec succès en base de données pour :", updatedUser.email);
        
        // 🔴 TRÈS IMPORTANT : Renvoyer ce message exact. 
        // C'est lui qui débloque le .subscribe() d'Angular pour rafraîchir le tableau à l'écran.
        res.json({ msg: "Status updated with success" });
    })
    .catch((err) => {
        console.error("Erreur lors de la mise à jour du statut :", err);
        res.status(500).json({ msg: "Server error", error: err });
    });
});



//Business Logic :Get all users

app.get("/users",(req, res) => {
    console.log("Business Logic : Get ALL users");
     User.find().then(
        (docs)=>{
            //docs : tableaux d'objets recupers de la collection  users
            console.log("Here is all objects from users collection",docs);
            res.json({tab :docs});
        }
    )
});


app.get("/users/teachers", (req, res) => {
    User.find({ role: "teacher" }).then(docs => res.json({ tab: docs }));
});

//Business Logic : Get User By id   

app.get("/users/:id", (req, res, next) => {
    
    // 🟢 SÉCURITÉ ABSOLUE : Si ce n'est pas un ID MongoDB de 24 caractères (ex: "students" ou "teachers")
    // on dit à Express de passer à la route suivante au lieu de crasher !
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(); 
    }

    // Votre code de recherche habituel
    User.findById(req.params.id)
        .then((doc) => res.status(200).json({ user: doc }))
        .catch((err) => res.status(500).json({ error: err.message }));
});



   //app.Http_METH("/PATH",(req, res) => {});

//Business Logic :Get all evaluations

app.get("/evaluations", (req, res) => {
    console.log("Business Logic : Get ALL evaluations");
    
    Evaluation.find()
        .populate('tId')
        .populate({ path: 'studentId', model: User }) // Fonctionne maintenant grâce à l'import ci-dessus
        .then((docs) => {
            // docs : tableau d'objets récupérés avec l'étudiant peuplé !
            console.log("Here is all objects from evaluations collection", docs);
            res.json({ tab: docs });
        })
        .catch((err) => {
            console.error("Error fetching evaluations:", err);
            res.status(500).json({ error: err });
        });
});

//Business Logic : Add Evaluation
app.post("/evaluations", (req, res) => {
    console.log("Business Logic : Add Evaluations", req.body);
    
    // 1. Chercher d'abord le cours
    Cour.findById(req.body.courId).then((foundCour) => {
        if (!foundCour) {
            return res.json({ msg: "Cour not found" });
        }

        // 2. Chercher ensuite l'étudiant (User)
        User.findById(req.body.studentId).then((foundStudent) => {
            if (!foundStudent) {
                return res.json({ msg: "Student not found" });
            }

            // 3. Créer l'évaluation avec des propriétés distinctes
            let evaluation = new Evaluation({
                evaluation: req.body.evaluation,
                note: req.body.note,
                tId: foundCour._id,         // Lien vers le cours (selon votre schéma actuel)
                studentId: foundStudent._id // 🛠️ Nouveau champ à ajouter dans votre schéma Evaluation
            });

            // 4. Sauvegarder l'évaluation
            evaluation.save().then((doc) => {
                // Ajouter l'ID de l'évaluation dans les deux listes parentes
                foundCour.evaluationsList.push(doc._id);
                foundStudent.studentsList.push(doc._id); // 🛠️ Assurez-vous que User a un tableau 'evaluationsList'

                // Sauvegarder le cours, puis l'étudiant, puis envoyer la réponse
                foundCour.save().then(() => {
                    foundStudent.save().then(() => {
                        return res.json({ msg: "Evaluation added with success" });
                    }).catch(err => res.json({ msg: "Error saving student updates" }));
                }).catch(err => res.json({ msg: "Error saving course updates" }));

            }).catch(err => res.json({ msg: "Error saving evaluation" }));

        }).catch(err => res.json({ msg: "Database error tracking student", error: err.message }));
    }).catch(err => res.json({ msg: "Database error tracking course", error: err.message }));
});


//Business Logic : Edit evaluations
app.put("/evaluations",(req, res) => { 
    console.log("Business Logic : Edit evaluations");
    // Get object from request
    //object contains ID and new values
    let newEvaluation = req.body; // req.body = {id:3,scoreOne:newvalue,scoreTwo:newvalue,teamOne :newvalue,
    // teamTwo:newvalue}
    Evaluation.updateOne({_id: req.body._id},newEvaluation).then(
        (updateRes) => {
            console.log("Here is update response",updateRes);
            if(updateRes.nModified == 1){
                res.json({msg: "Edited with success"});
            } else {
               res.json({ msg: "Evaluation not Edited" }); 
            }
            
        }
    )
});

//Business Logic : Get Evaluation By id
// :id :m'id est une parametre (variable)

app.get("/evaluations/:id", (req, res) => {
    Evaluation.findById(req.params.id)
        .populate('tId')
        .populate({ path: 'studentId', model: 'User', select: '-password' })
        .then((doc) => {
            if (!doc) {
                return res.status(404).json({ msg: "Evaluation not found" });
            }
            res.json({ evaluation: doc });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});



//Business Logic : DELETE Evaluation By id
app.delete("/evaluations/:id",(req, res) => {
    console.log("Business Logic : Delete evaluation By ID ");
    let evaluationId= req.params.id;
        Evaluation.deleteOne({_id: evaluationId}).then(
     (deleteRes)=>{
        console.log("Here is deleteRes ",deleteRes);
        if(deleteRes.deletedCount == 1 ){
            res.json({msg: "Deleted with success"});

        } else {
            res.json({msg: "Evaluation Not found"});
        }
     }

    )

    });

//Business Logic : Add CLasse

// Recherchez app.get("/classes") ou router.get("/classes")
//Business Logic : Add MATCH
app.post("/classes", (req, res) => {
    console.log("Business Logic : Add classes", req.body);

    // 1. Chercher d'abord le cours
    Cour.findById(req.body.courId).then((foundCour) => {
        if (!foundCour) {
            return res.json({ msg: "Cour not found" });
        }
     // 2. Chercher ensuite l'étudiant (User)
        User.findById(req.body.studentId).then((foundStudent) => {
            if (!foundStudent) {
                return res.json({ msg: "Student not found" });
            }

      // 3. Créer l'évaluation avec des propriétés distinctes
                  let classe = new Classe({
                     name: req.body.name,
                    
                    //tId: req.body.teamId
                    tId: foundStudent._id,
                    courId: foundCour._id // 
            });

    // 4. Sauvegarder l'évaluation
            classe.save().then((doc) => {
                // Ajouter l'ID de l'évaluation dans les deux listes parentes
                foundCour.coursList.push(doc._id);
                foundStudent.classesList.push(doc._id); // 🛠️ Assurez-vous que User a un tableau 'evaluationsList'

                // Sauvegarder le cours, puis l'étudiant, puis envoyer la réponse
                foundCour.save().then(() => {
                    foundStudent.save().then(() => {
                        return res.json({ msg: "classe added with success" });
                    }).catch(err => res.json({ msg: "Error saving student updates" }));
                }).catch(err => res.json({ msg: "Error saving course updates" }));

            }).catch(err => res.json({ msg: "Error saving classe" }));

        }).catch(err => res.json({ msg: "Database error tracking student", error: err.message }));
    }).catch(err => res.json({ msg: "Database error tracking course", error: err.message }));
});      

                


app.get("/classes",(req, res) => {
    console.log("Business Logic : Get ALL classe");
        Classe.find().populate('tId').populate('courId') .then(
        (docs)=>{
            //docs : tableaux d'objets recupers de la collection  evaluations
            console.log("Here is all objects from evaluations collection",docs);
            res.json({tab :docs});
        }
    )
});

//Business Logic : Get classes By id
// :id :m'id est une parametre (variable)

app.get("/classes/:id", (req, res) => {
    console.log("Business Logic : Get classes By ID", req.params.id);
    let classeId = req.params.id; 

    Classe.findById(classeId)
   .populate({ path: 'tId', model: 'User', select: 'firstName lastName phone' }).populate('courId')
        .then((doc) => {
            console.log("Here is doc from classes collection", doc);
            
            if (!doc) {
                return res.status(404).json({ message: "Classe introuvable" });
            }

            // ✔️ Correction : On utilise 'classe' au singulier pour s'aligner avec Angular
            res.json({ classe: doc }); 
        })
        .catch((err) => {
            console.error("Erreur Mongoose :", err.message);
            res.status(500).json({ error: "Internal Server Error", details: err.message });
        });
});


//Business Logic : Edit Classe
app.put("/classes",(req, res) => { 
    console.log("Business Logic : Edit classes");
    // Get object from request
    //object contains ID and new values
    let newClasse = req.body; // req.body = {id:3,scoreOne:newvalue,scoreTwo:newvalue,teamOne :newvalue,
    // teamTwo:newvalue}
    Classe.updateOne({_id: req.body._id},newClasse).then(
        (updateRes) => {
            console.log("Here is update response",updateRes);
            if(updateRes.nModified == 1){
                res.json({msg: "Edited with success"});
            } else {
               res.json({ msg: "Classe not Edited" }); 
            }
            
        }
    )
});

//Business Logic : DELETE Classe By id
app.delete("/classes/:id", (req, res) => {
    console.log("Business Logic : Delete classes By ID ");
    let classeId = req.params.id;
    Classe.deleteOne({_id: classeId}).then(
     (deleteRes)=>{
        console.log("Here is deleteRes ",deleteRes);
        if(deleteRes.deletedCount == 1 ){
            res.json({msg: "Deleted with success"});

        } else {
            res.json({msg: "Classe Not found"});
        }
     }

    )

});


// Récupérer tous les cours d'un étudiant donné
app.get("/cours/student/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        console.log("Business Logic : Get Cours By Student ID", studentId);

        // 1. Trouver l'étudiant et récupérer son tableau de classes (classesList)
        const etudiant = await User.findById(studentId);

        if (!etudiant) {
            return res.status(404).json({ error: "Étudiant introuvable" });
        }

        // Vérifier si l'étudiant est bien inscrit dans au moins une classe
        if (!etudiant.classesList || etudiant.classesList.length === 0) {
            console.log("L'étudiant n'est inscrit dans aucune classe.");
            return res.status(200).json({ tab: [], message: "L'étudiant n'a pas de classe assignée." });
        }

        // 2. Récupérer le premier ID de classe de l'étudiant
        // (Si un étudiant peut avoir plusieurs classes, on cible la première indexée)
        const classeId = etudiant.classesList[0];

        console.log(`Classe trouvée pour l'étudiant : ${classeId}`);

        // 3. Trouver tous les cours qui sont dispensés à cette classe
        // Rappel : dans votre schéma Cour, le tableau des classes s'appelle 'coursList'
        const cours = await Cour.find({ coursList: classeId })
            .populate("tId", "firstName lastName email specialite photo"); // Remplit les infos du prof

        // 4. Renvoyer la liste finale des cours au frontend Angular
        res.status(200).json({ tab: cours });

    } catch (err) {
        console.error("Erreur serveur lors de la récupération des cours :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Assurez-vous d'avoir importé vos deux modèles en haut du fichier :
// const User = require("./models/user"); // Votre modèle Étudiant
// const Evaluation = require("./models/evaluation"); // Votre modèle Évaluation

app.get("/users/students/search/:phone", (req, res) => {
    let phoneParam = req.params.phone;

    User.findOne({ role: "student", phone: phoneParam })
        .then((student) => {
            if (!student) {
                return res.json({ msg: "No students found" });
            }

            Evaluation.findOne({ studentId: student._id })
                .populate('tId') // récupère le cours
                .then((evaluationDoc) => {
                    let studentWithGrade = {
                        _id: student._id,
                        // champs à plat conservés (au cas où d'autres pages les utilisent)
                        firstName: student.firstName,
                        lastName: student.lastName,
                        phone: student.phone,
                        // même forme que GET /evaluations/:id
                        studentId: {
                            _id: student._id,
                            firstName: student.firstName,
                            lastName: student.lastName,
                            phone: student.phone
                        },
                        tId: evaluationDoc ? evaluationDoc.tId : null,
                        note: evaluationDoc ? evaluationDoc.note : null,
                        evaluation: evaluationDoc ? evaluationDoc.evaluation : "Aucune remarque"
                    };

                    return res.json({ students: [studentWithGrade] });
                })
                .catch((err) => {
                    console.error("Erreur lors de la recherche de l'évaluation :", err);
                    return res.status(500).json({ error: "Erreur serveur" });
                });
        })
        .catch((err) => {
            console.error("Erreur lors de la recherche de l'étudiant :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        });
});

app.get("/users/teachers/:id/students", async (req, res) => {
    try {
        const teacherId = req.params.id;

        // 1. Cours de ce teacher
        const cours = await Cour.find({ tId: teacherId }).select('_id');
        const coursIds = cours.map(c => c._id);

        // 2a. Students inscrits via les classes
        const classes = await Classe.find({ courId: { $in: coursIds } }).select('tId');

        // 2b. Students évalués dans ces cours
        const evaluations = await Evaluation.find({ tId: { $in: coursIds } }).select('studentId');

        // 3. Ids uniques
        const studentIds = [...new Set([
            ...classes.filter(c => c.tId).map(c => String(c.tId)),
            ...evaluations.filter(e => e.studentId).map(e => String(e.studentId))
        ])];

        // 4. Students avec leurs classes et cours peuplés
        const students = await User.find({ _id: { $in: studentIds }, role: 'student' })
            .select('-pwd')
            .populate({
                path: 'classesList',
                populate: {
                    path: 'courId',
                    populate: { path: 'tId', select: 'firstName lastName email photo specialite' }
                }
            });

        // 5. Ne garder que les classes des cours de ce teacher
        const result = students.map(s => {
            const obj = s.toObject();
            obj.classesList = (obj.classesList || []).filter(cl =>
                cl.courId && cl.courId.tId && String(cl.courId.tId._id) === String(teacherId)
            );
            return obj;
        });

        res.status(200).json({ tab: result });
    } catch (err) {
        console.error("Erreur students du teacher :", err);
        res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});



// make app importable
module.exports = app;