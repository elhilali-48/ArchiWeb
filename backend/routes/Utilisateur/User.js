const express = require("express");
const router = express.Router();

// Appeler le contrôleur 

const userControlleur = require("../../controllers/Utilisateur/User")


// Liste des routes pour l'USER 


router.put('/change_password/:id',userControlleur.changePassword);
router.post('/login',userControlleur.login);
router.post('/logout',userControlleur.logout);
router.get('/profile',userControlleur.profile);
router.get('/getInfo/:id',userControlleur.getInfo);
router.put('/updateProfile/:id',userControlleur.updateProfile)
router.get('/statistique/:id',userControlleur.getStatistique)



module.exports = router