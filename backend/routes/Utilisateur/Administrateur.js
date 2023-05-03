const express = require("express");
const router = express.Router();

// Appeler le contrôleur 

const adminControleur = require("../../controllers/Utilisateur/Administrateur")

// Liste des routes pour l'administrateur 

router.post('/create',adminControleur.CreateAdmin);
router.get('/show/:id',adminControleur.readAdmin);
router.delete('/delete/:id',adminControleur.deleteAdmin);
router.put('/update/:id',adminControleur.updateAdmin);


module.exports = router