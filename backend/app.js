// ---------------- Initialisation --------------------
const express= require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")
// Import Package Authentification 
const passport = require("passport")
const session = require("express-session")
const LocalStrategy = require("passport-local").Strategy
// ------------ Paramétre de l'image---------
const multer = require('multer')
const path = require('path');

app.use('/images', express.static(path.join(__dirname, 'public/image/projet')));


// Import Nodemailer

const nodemailer = require('nodemailer')
// ----------------- Routes --------------------------

const routeAdmin = require('./routes/Utilisateur/Administrateur')
const routeEnseignant = require('./routes/Utilisateur/Enseignant')
const routeEtudiant = require('./routes/Utilisateur/Etudiant')
const routeUser = require('./routes/Utilisateur/User')
const routeProjet = require('./routes/Utilisateur/Projet')

const control = require('./controllers/Utilisateur/User')
// Accéder à la partie Front-end Angular :

app.use(
    cors({
        origin : "http://localhost:4200",
    })
)


// connecté à la base de données 
mongoose
 .connect("mongodb+srv://elhilaliabdelouahab:naWkOwea2R0bJceu@archiweb.z9jw8kz.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true })
 .then(()=>{
    console.log("Connexion réussi à la base de données");
 }).catch((e)=>{
    console.log("Connexion échoué Err : " +e);
 })    


// Utiliser le bodyParser pour qui permet d'accéder facilement aux données envoyées dans le corps de la requête
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("test")
})

app.use('/admin',routeAdmin)
app.use('/enseignant',routeEnseignant)
app.use('/etudiant',routeEtudiant)
app.use('/user',routeUser)
app.use('/projet',routeProjet)

app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
  }))

app.use(passport.initialize()) 

app.use(passport.session())

passport.use(new LocalStrategy(control.login))


// Nodemailer : 


module.exports = app