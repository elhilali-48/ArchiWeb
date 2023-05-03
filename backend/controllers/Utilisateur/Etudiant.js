const Etudiant = require("../../models/Etudiant");
const bcrypt = require("bcrypt");
const Users = require("../../models/Users");


// ---------------- Create -------------------

module.exports.createEtudiant = async(req,res)=>{
  try {
    // Vérifier si l'email existe dans la BDD
    const email = req.body.email;

    const user = await Users.findOne({email}).exec();

    if (user) {
      res.status(401).json({ error: 'Cet email est déjà utilisé' });
    } else {
      // Ajouter dans la table Users : 

      const passwordCrypt = await bcrypt.hash(req.body.password, 10);
      const AddUser = await Users.create({
        email : req.body.email,
        password : passwordCrypt,
        role : "Enseignant"
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
        res.status(201).json({ etudiant });
      }
      else{
        res.status(401).json({ error: 'Erreur' });
      }
      
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// ----------------------Read (Show)------------------------------

module.exports.readEtudiant = async(req,res)=>{
    try {
        const etudiant = await Etudiant.findById(req.params.id).populate("user_id");
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
    const { nom, prenom, dateNaissance, sexe } = req.body;
    try {
        // Vérifier si l'enseignant existe dans la BDD
        const etudiant = await Etudiant.findById(id);
    
        if (!etudiant) {
          return res.status(404).json({ message: "L'étudiant n'existe pas" });
        }
    
        // Mettre à jour les informations de l'enseignant
        etudiant.nom = nom;
        etudiant.prenom = prenom;
        etudiant.dateNaissance = dateNaissance;
        etudiant.sexe = sexe;
    
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
    const etudiant = await Etudiant.findOneAndRemove({ user_id: req.params.id })
      if (!etudiant) {
        return res.status(404).json({ message: "L'étudiant n'a pas été trouvé" });
      }
      // Supprime également l'enregistrement dans l'autre table
    const user = await Users.findOneAndRemove({ _id: req.params.id })
      if(!user){
        return res.status(404).json({ message: "L'user n'a pas été trouvé" });
      }
    res.status(201).json("L'étudiant a été bien supprimé")
  } catch (error) {
    res.status(401).json({error : error.message})
  }
}