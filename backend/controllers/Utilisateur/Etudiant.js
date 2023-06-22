const Etudiant = require("../../models/Etudiant");
const bcrypt = require("bcrypt");
const Users = require("../../models/Users");
const transporter = require('../../nodemail')

// ---------------- Create -------------------

module.exports.createEtudiant = async(req,res)=>{
  try {
    // Vérifier si l'email existe dans la BDD
    const email = req.body.email;

    const user = await Users.findOne({email}).exec();

    if (user) {
      res.status(401).json({status : res.statusCode, error: 'Cet email est déjà utilisé' });
    } else {
      // Ajouter dans la table Users : 

      const passwordCrypt = await bcrypt.hash(req.body.password, 10);
      const AddUser = await Users.create({
        email : req.body.email,
        password : passwordCrypt,
        role : "Etudiant"
      })
      
      // Vérifier si user est bien ajouté dans la table Users 
      if(AddUser){
        // Ajouter dans la table Administrateur 
        const etudiant = await Etudiant.create({
          nom: req.body.nom,
          prenom: req.body.prenom,
          dateNaissance: req.body.dateNaissance,
          user_id : AddUser._id,
          sexe : req.body.sexe
        });
        res.json({ etudiant });
        // Envoyer un mail de création de compte avec le mot de passe 
        const mailOptions = {
          from: 'archiWeb@gmail.com',
          to: req.body.email,
          subject: 'ArchiWeb : Création de compte',
          html: `
          <h1>Création de compte Etudiant</h1>
  
          <p>Bonjour ${req.body.nom},</p>
          
          <p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter en utilisant les informations suivantes :</p>
          
          <p><strong>Nom d'utilisateur :</strong> ${req.body.email}</p>
          <p><strong>Mot de passe :</strong> ${req.body.password}</p>
          
          <p>Veuillez changer votre mot de passe après votre première connextion.</p>
          
          <p>Merci et bienvenue !</p>
          
          <p>L'équipe du site web ArchiWeb</p>
          `
        };
    
       await transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.status(401).json({ status : res.statusCode, error: 'Problème dans l\'envoie de l\'email' });
          } else {
            res.status(200).json({ status : res.statusCode, message : "L'étudiant a été créer avec succés" });
          }
        });
      }
      else{
        res.status(401).json({stauts :res.statusCode, error: 'Erreur' });
      }
      
    }
  } catch (error) {
    //res.status(401).json({ status :res.statusCode, error: error.message });
    //return;
  }
}


// ----------------------Read (Show)------------------------------

module.exports.readEtudiant = async(req,res)=>{
    try {
        const etudiant = await Etudiant.findOne({user_id : req.params.id}).populate("user_id");
        if(!etudiant){
            return res.status(404).json({message : 'Etudiant non trouvé'});
        }
        res.status(201).json(etudiant)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

// -------------------------- Update (Modifier) -----------------------
    // Ramarque => L'email ne peut pas etre modifier
module.exports.updateEtudiant = async(req,res)=>{

    const { id } = req.params;
    const { nom, prenom, dateNaissance, sexe, email } = req.body;
    try {
      const user = await Users.findById(id);
      if(!user){
        return res.status(404).json({status: res.statusCode, message: "L'etudiant n'existe pas" });
      }

      // Vérifier si l'email renseigné est différent de l'ancien email
      if(email != user.email){
        const check_email = await Users.findOne({email : email})
        if(check_email){
          return res.status(404).json({status : res.statusCode, message: "Ce email existe déjà" });
        }
        else{
          user.email = email;
          const updateEmail = await user.save();
        }
      }
        // Vérifier si l'enseignant existe dans la BDD
        const etudiant = await Etudiant.findOne({user_id : id});
    
        if (!etudiant) {
          return res.status(404).json({ message: "L'étudiant n'existe pas" });
        }
    
        // Mettre à jour les informations de l'enseignant
        etudiant.nom = nom;
        etudiant.prenom = prenom;
        etudiant.dateNaissance = dateNaissance;
        etudiant.sexe = sexe;
        // etudiant.updateAt  =Date.now
    
        // Sauvegarder les modifications dans la BDD
        const updatedEtudiant= await etudiant.save();
    
        res.status(200).json({ etudiant: updatedEtudiant });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}


// -------------------------- Delete(Supprimer)----------------------------

module.exports.deleteEtudiant = async(req,res)=>{
  try {
    const etudiant = await Etudiant.findOne({ user_id: req.params.id })
      if (!etudiant) {
        return res.status(404).json({status : res.statusCode, message: "L'étudiant n'a pas été trouvé" });
      }

      if(etudiant.projetsInscrits.length > 0){
        return res.status(404).json({status : res.statusCode, message: "L'étudiant est inscrits dans un projet, impossible de le supprimer" });
      }
      // Supprime également l'enregistrement dans l'autre table
    const user = await Users.findOne({ _id: req.params.id })
      if(!user){
        return res.status(404).json({status : res.statusCode, message: "L'user n'a pas été trouvé" });
      }
      await Etudiant.deleteOne({ user_id: req.params.id });
      await Users.deleteOne({ _id: req.params.id });
    res.status(201).json({status : res.statusCode , message : "L'étudiant a été bien supprimé" })
  } catch (error) {
    res.status(401).json({status : res.statusCode,error : error.message})
  }
}