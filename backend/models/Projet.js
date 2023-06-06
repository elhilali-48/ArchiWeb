const mongoose = require("mongoose");
const {isEmail} = require("validator")
const Shema = mongoose.Schema;


// Créer le model pour le projet 

const projetschema = mongoose.Schema({
    titre : {
        type : String,
        required : true,
        minlength : 10,
    },
    description : {
        type : String,
        required : true,
        minlength : 20,
    },
    competence_acquis : [
        {
            type : String,
        }
    ],
    competence_requis : [
        {
            type : String,
        }
    ],
    enseignant_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Enseignant',
        // required : true
    },
    // enseignant_id : {
    //     type : String,
    //     // required : true
    // },
    resultatsEtudiants: [
        {
            etudiantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Etudiant'
            },
            competencesAcquises: [
                {
                    nom: String,
                    etat: {
                        type: String,
                        enum: ['Non acquise', 'En cours d\'acquisition', 'Acquise'],
                        default : 'Non acquise',
                    },
                    progression : {
                        type : Number,
                        default : 0,
                        min : 0,
                        max : 100,
                        
                    }
                }
            ],
            status : {
                type : String,
                enum : ["En cours", "Terminé", "Abandonné"]
            },
            inscriptionDate :{
                type: Date,
                default: Date.now
            }
        }
    ],
    status : {
        type : String,
        enum: ['En cours', 'Archivé']
    },
    imagePath : {
        type : String,
        default : "default.webp"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
    }


})


module.exports = mongoose.model("Projet",projetschema)