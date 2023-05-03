const mongoose = require("mongoose");
const {isEmail} = require("validator")

// Créer le model pour l'administrateur 

const adminSchema = mongoose.Schema({
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
    isSuperAdmin : {
        type : Boolean,
        required : true,
        default : false,
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


module.exports = mongoose.model("Administrateur",adminSchema)