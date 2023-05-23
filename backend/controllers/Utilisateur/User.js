// Import Package pour crypter le mot de passe 
const bcrypt = require("bcrypt");
const Users = require("../../models/Users");
const Admin = require("../../models/Administrateur");
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
            res.status("401").json({error : "User est introuvable dans la BDD"});
        }
        const comparePassword  = await bcrypt.compare(req.body.oldPassword,user.password);
        if(!comparePassword){
            res.json({error : "L'ancien mot de passe est incorrect."})
        }
        // Crypter le nouveau mot de passe 
        const passwordCrypt = await bcrypt.hash(req.body.newPassword, 10);
        // Mettre à jour le mot de passe
        user.password = passwordCrypt
        // Sauvegarder les modifications dans la BDD
        const updatedPassword = await user.save();
        res.status(200).json({ message: "Le mot a été bien modifié" });
    } catch (error) {
        res.status(500).json({error : error.message})
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