const express = require("express");
const router = express.Router();

// Appeler le contrôleur 

const enseignantControleur = require("../../controllers/Utilisateur/Enseignant")


// Liste des routes pour l'administrateur 


router.post('/create',enseignantControleur.createEnseignant);
router.get('/get/:id',enseignantControleur.readEnseignant)
router.delete('/delete/:id',enseignantControleur.deleteEnseignant);
router.put('/update/:id',enseignantControleur.updateEnseignant)


module.exports = router