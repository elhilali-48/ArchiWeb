// Import Package pour crypter le mot de passe 
const bcrypt = require("bcrypt");
const Users = require("../../models/Users");
const Admin = require("../../models/Administrateur");
const Projet = require("../../models/Projet")
const Etudiant = require("../../models/Etudiant");
const Enseignant = require("../../models/Enseignant");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require('dotenv');
const Administrateur = require("../../models/Administrateur");
dotenv.config();

// A vérifier 
// ------------- Modifier un mot de passe --------------------

module.exports.changePassword = async(req,res)=>{
    try {
      
        const user = await Users.findById(req.params.id);
        
        if(!user){
            res.status(401).json({status : res.statusCode,error : "User est introuvable dans la BDD"});
        }
        const comparePassword  = await bcrypt.compare(req.body.oldPassword,user.password);

        if(!comparePassword){
            res.status(400).json({status : res.statusCode,message : "L'ancien mot de passe est incorrect."})
            return;
        }
        // Crypter le nouveau mot de passe 
        const passwordCrypt = await bcrypt.hash(req.body.newPassword, 10);
        // Mettre à jour le mot de passe
        user.password = passwordCrypt
        // Sauvegarder les modifications dans la BDD
        const updatedPassword = await user.save();
        res.status(200).json({status: res.statusCode, message: "Le mot a été bien modifié" });
    } catch (error) {
        res.status(500).json({status : res.statusCode,error : error.message})
    }
}


// --------------------------- Login -------------------------------------------------------

module.exports.login = async(req,res,done)=>{
    // Search user in BDD 
    try {
        const user = await Users.findOne({email : req.body.email});
        // Vérifier si l'email existe
        if(!user){
            res.status(404).json({status : res.statusCode,message : "Aucun utilisateur correspond à cet email"})
            return;
        }
        // Vérifier si le mot de passe est correcte 

        const comparePassword = await bcrypt.compare(req.body.password,user.password);
        
        if(!comparePassword){
          res.status(404).json({status : res.statusCode,message : "Le mot de passe est incorrect"})
            return;
        }

        // Créer un token 
       // let authenticated_user = {id : user._id, email : user.email};
        //const test = done(null,authenticated_user)
        const token  = jwt.sign({id : user._id},process.env.secret_key,{expiresIn : '60s'})
        res.status(201).json({token : token,statut  :res.statusCode})
        //return done(null, authenticated_user)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

module.exports.profile = async(req,res)=>{
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    if (authHeader) {
      const token = authHeader.substring(7);
      jwt.verify(token, process.env.secret_key, (err, user) => {
        if (user) {
          res.status(200).json({
            status: res.statusCode,
            data: user,
          });
        } else {
          res.status(401).json({
            status: res.statusCode,
            message: "Invalid or expired token",
          });
        }
      });
    } else {
      res.status(401).json({
        status: res.statusCode,
        message: "Authorization header is missing",
      });
    }
}

module.exports.getInfo = async(req,res)=>{
  const user = await Users.findOne({_id : req.params.id})
  
  switch (user.role) {
    case 'Enseignant':

    const info_enseignant =  await Users.aggregate([
      { 
        $match: { _id: user._id } // filtre pour récupérer uniquement l'utilisateur spécifié
      },
      {
        $lookup: {
          from: "enseignants",
          localField: "_id",
          foreignField: "user_id",
          as: "info"
        }
      }
   ])
     
     res.status(201).json({data : info_enseignant, status : res.statusCode})
      break;
    case 'Admin':
      const info_admin =  await Users.aggregate([
        { 
          $match: { _id: user._id } // filtre pour récupérer uniquement l'utilisateur spécifié
        },
        {
          $lookup: {
            from: "administrateurs",
            localField: "_id",
            foreignField: "user_id",
            as: "info"
          }
        }
     ])
     res.status(201).json({data : info_admin, status : res.statusCode})
       
      break;
    case 'Etudiant':
      const info_etudiants =  await Users.aggregate([
        { 
          $match: { _id: user._id } // filtre pour récupérer uniquement l'utilisateur spécifié
        },
        {
          $lookup: {
            from: "etudiants",
            localField: "_id",
            foreignField: "user_id",
            as: "info"
          }
        }
     ])
       res.status(201).json({data : info_etudiants, status : res.statusCode})
    break;
    default:
      console.log("Error");
  }
  //res.json(user.role);
}

// ---------------------------------------- Modifier les informations dans profile -------------------------------------

module.exports.updateProfile = async(req,res)=>{
  try {
    // Chercher l'user id 

    const user = await Users.findById(req.params.id)
    if(user){
      // Selon le role on modifier les infos dans la table correspondante.
      switch (user.role) {
        case 'Enseignant':
          const enseignant = await Enseignant.findOne({user_id:  user._id})
          if(enseignant){
            enseignant.nom = req.body.nom
            enseignant.prenom = req.body.prenom
            enseignant.dateNaissance = req.body.dateNaissance
            enseignant.sexe = req.body.sexe

            const saveDataEnseignant = await enseignant.save()

            if(saveDataEnseignant){
              res.status(200).json({status : res.statusCode,message: "Information modifié"})
            }else{
              res.status(400).json({status : res.statusCode,message: "Erruer !! Veuillez réessayer ultérieurement"})
            }
          }else{
            res.status(400).json({status : res.statusCode,message: "Ancun Enseignant trouvé avec ce Id"})
          }
        break;
        case 'Admin':
          const admin = await Administrateur.findOne({user_id:  user._id})
          if(admin){
            admin.nom = req.body.nom
            admin.prenom = req.body.prenom
            admin.dateNaissance = req.body.dateNaissance
            admin.sexe = req.body.sexe

            const saveDataAdmin = await admin.save()

            if(saveDataAdmin){
              res.status(200).json({status : res.statusCode,message: "Information modifié"})
            }else{
              res.status(400).json({status : res.statusCode,message: "Erruer !! Veuillez réessayer ultérieurement"})
            }
          }else{
            res.status(400).json({status : res.statusCode,message: "Ancun Administrateur trouvé avec ce Id"})
          }
        break;
        case 'Etudiant':
          const etudiant = await Etudiant.findOne({user_id:  user._id})
          if(etudiant){
            etudiant.nom = req.body.nom
            etudiant.prenom = req.body.prenom
            etudiant.dateNaissance = req.body.dateNaissance
            etudiant.sexe = req.body.sexe

            const saveDataEtudiant = await etudiant.save()

            if(saveDataEtudiant){
              res.status(200).json({status : res.statusCode,message: "Information modifié"})
            }else{
              res.status(400).json({status : res.statusCode,message: "Erruer !! Veuillez réessayer ultérieurement"})
            }
          }else{
            res.status(400).json({status : res.statusCode,message: "Ancun Etudiant trouvé avec ce Id"})
          }
        break;
        default:
          console.log("Error");
      }
    }else{
      res.status(401).json({status :res.statusCode, error : "Aucun utilisateur trouvé avec cet Id"})
    }
    
  } catch (error) {
    res.status(500).json({status : res.statusCode,error : error.message})

  }
}

// --------------------------------- Statistique Dashbord ----------------------------------------------

module.exports.getStatistique = async(req,res)=>{
  try {
    const user = await Users.findById(req.params.id);
    if(user){
      // Statistique pour Administrateur
      if(user.role == "Admin"){
        
        const nbEtudiant = await Etudiant.count();
        const nbEnseignant = await Enseignant.count();
        const nbAdmin = await Administrateur.count();
        res.status(200).json({status : res.statusCode,user,statAdmin : {nbAdmin,nbEnseignant,nbEtudiant}})
      }

      if(user.role == "Etudiant"){
        
        const etudiant = await Etudiant.findOne({user_id : user._id})
        // count projects
        const countOfProjects = etudiant.projetsInscrits.length
        // count competences acquis
        const countCompetence = etudiant.competences.length

        res.status(200).json({status : res.statusCode, user,statEtud : {countOfProjects,countCompetence}})
      }

      // Statistique pour Enseignant
      if(user.role == "Enseignant"){
        const enseignant = await Enseignant.findOne({user_id : user._id})
        
        // Nommbre de projet
        const projetCount = await Projet.count({enseignant_id: enseignant._id});
        // Nombre de projet active
        const projetArchive = await Projet.count({
          $and: [
            { status: "Archivé" },
            { enseignant_id: enseignant._id }
          ]
        });
        // Nombre de projet Actif
        const projetActif = await Projet.count({
          $and: [
            { status: "En cours" },
            { enseignant_id: enseignant._id }
          ]
        });
        // Nombre des étudiants total dans tous mes projets

        const countEtudiants = await Projet.aggregate([
          {
            $match: { enseignant_id: enseignant._id }
          },
          {
            $group: {
              _id: null,
              totalEtudiants: { $sum: { $size: "$resultatsEtudiants" } }
            }
          }
        ]);

        // Nombres des étudiants qui ont réussi leur projet 

        const projets = await Projet.find({enseignant_id: enseignant._id});

        let countEtudiantsTermines = 0;
        projets.forEach(projet => {
          const etudiantsTermines = projet.resultatsEtudiants.filter(etudiant => etudiant.status === "Terminé");
          countEtudiantsTermines += etudiantsTermines.length;
        });

        // Nombre des étudiants qui ont En cours

        let countEtudiantsEncours = 0;
        projets.forEach(projet => {
          const etudiantsEncours = projet.resultatsEtudiants.filter(etudiant => etudiant.status === "En cours");
          countEtudiantsEncours += etudiantsEncours.length;
        });

         // Nombre des étudiants qui ont abondonnée

         let countEtudiantsAbondon = 0;
         projets.forEach(projet => {
           const etudiantsAbondone = projet.resultatsEtudiants.filter(etudiant => etudiant.status === "Abonndoné");
           countEtudiantsAbondon += etudiantsAbondone.length;
         });

        res.status(200).json({status : res.statusCode,user,stat : {projetCount,projetArchive,projetActif,countEtudiantsEncours,countEtudiants,countEtudiantsTermines,countEtudiantsEncours,countEtudiantsAbondon}})
      }
      // Statistique pour Etudiant
      if(user.role == "Etudiant"){

      }
    }else{
      res.status(401).json({status : res.statusCode,message : "Aucun utilisateur trouvé avec cet ID"})
    }
  } catch (error) {
    res.status(500).json({status : res.statusCode,error : error.message})
  }
}