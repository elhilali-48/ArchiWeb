const mongoose = require("mongoose");
const {isEmail} = require("validator")
const Shema = mongoose.Schema;


// Créer le model pour l'enseignant 

const enseignantSchema = mongoose.Schema({
    nom : {
        type : String,
        required : true,
        maxlength : 50,
        minlength : 2,
    },
    prenom : {
        type : String,
        required : true,
        maxlength : 50,
        minlength : 2,
    },
    dateNaissance : {
        type : Date,
        required : true,
    },
    sexe : {
        type : String,
        required : true,
        enum: ['homme', 'femme']
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
    }


})


module.exports = mongoose.model("Enseignant",enseignantSchema)