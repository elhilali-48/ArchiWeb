const express = require("express");
const router = express.Router();

// Appeler le contrôleur 

const projetControlleur = require("../../controllers/Utilisateur/Projet")


// Liste des routes pour l'enseignant => Projet


router.post('/create',projetControlleur.createProjet);
//router.get('/get/:id',projetControlleur.readEtudiant)
router.delete('/delete/:id',projetControlleur.deleteProjet);
//router.put('/update/:id',projetControlleur.updateEtudiant)
router.get('/getAllProjets',projetControlleur.getAllProjets)

router.get('/getOneProjet/:id',projetControlleur.getOneProjets);

router.get('/getMyProjets',projetControlleur.getMyProjets);

router.put('/archiveProjet/:id',projetControlleur.archiveProjet);

router.put('/updateProjet/:id',projetControlleur.updateProjet)

router.post('/inscrireProjet',projetControlleur.inscrire_projet)

router.post('/abandonnerProjet',projetControlleur.abandonner)

router.get('/mes_projets/:id',projetControlleur.mesProjets)

module.exports = router