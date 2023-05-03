// ---------------- Initialisation --------------------
const express= require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")

// ----------------- Routes --------------------------

const routeAdmin = require('./routes/Utilisateur/Administrateur')
const routeEnseignant = require('./routes/Utilisateur/Enseignant')
const routeEtudiant = require('./routes/Utilisateur/Etudiant')
const routeUser = require('./routes/Utilisateur/User')

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

module.exports = app