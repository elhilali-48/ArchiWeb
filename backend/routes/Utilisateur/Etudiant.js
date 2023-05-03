const express = require("express");
const router = express.Router();

// Appeler le contrôleur 

const etudiantControlleur = require("../../controllers/Utilisateur/Etudiant")


// Liste des routes pour l'administrateur 


router.post('/create',etudiantControlleur.createEtudiant);
router.get('/get/:id',etudiantControlleur.readEtudiant)
router.delete('/delete/:id',etudiantControlleur.deleteEtudiant);
router.put('/update/:id',etudiantControlleur.updateEtudiant)


module.exports = router