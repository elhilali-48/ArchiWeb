const express = require("express");
const router = express.Router();

// Appeler le contrôleur 

const userControlleur = require("../../controllers/Utilisateur/User")


// Liste des routes pour l'USER 


router.put('/change_password/:id',userControlleur.changePassword);


module.exports = router