const mongoose = require("mongoose");
const {isEmail} = require("validator")

// Créer le model pour les utilisateurs, ce model contient juste l'email, le password et le role de l'utilisateur 

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        trimp : true,
        lowercase : true,
        validate : [isEmail, "le format de l\'email est invalid"],
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    role : {
        type : String,
        required : true,
        enum: ['Admin', 'Etudiant','Enseignant']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
    }

})

module.exports = mongoose.model("Users",userSchema)