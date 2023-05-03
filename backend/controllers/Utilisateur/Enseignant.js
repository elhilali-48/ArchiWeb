const Enseignant = require("../../models/Enseignant");
const bcrypt = require("bcrypt");
const Users = require("../../models/Users");


// ---------------- Create -------------------

module.exports.createEnseignant = async(req,res)=>{
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
        const enseignant = await Enseignant.create({
          nom: req.body.nom,
          prenom: req.body.prenom,
          dateNaissance: req.body.dateNaissance,
          user_id : AddUser._id,
          sexe : req.body.sexe
        });
        res.status(201).json({ enseignant });
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

module.exports.readEnseignant = async(req,res)=>{
    try {
        const enseignant = await Enseignant.findById(req.params.id).populate("user_id");
        if(!enseignant){
            return res.status(404).json({message : 'Enseignant non trouvé'});
        }
        res.status(201).json(enseignant)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

// -------------------------- Update (Modifier) -----------------------
    // Ramarque => L'email ne peut pas etre modifier
module.exports.updateEnseignant = async(req,res)=>{

    const { id } = req.params;
    const { nom, prenom, dateNaissance, sexe } = req.body;
    try {
        // Vérifier si l'enseignant existe dans la BDD
        const enseignant = await Enseignant.findById(id);
    
        if (!enseignant) {
          return res.status(404).json({ message: "L'enseignant n'existe pas" });
        }
    
        // Mettre à jour les informations de l'enseignant
        enseignant.nom = nom;
        enseignant.prenom = prenom;
        enseignant.dateNaissance = dateNaissance;
        enseignant.sexe = sexe;
    
        // Sauvegarder les modifications dans la BDD
        const updatedEnseignant = await enseignant.save();
    
        res.status(200).json({ enseignant: updatedEnseignant });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}


// -------------------------- Delete(Supprimer)----------------------------

module.exports.deleteEnseignant = async(req,res)=>{
  try {
    const admin = await Enseignant.findOneAndRemove({ user_id: req.params.id })
      if (!admin) {
        return res.status(404).json({ message: "L'enseignant n'a pas été trouvé" });
      }
      // Supprime également l'enregistrement dans l'autre table
    const user = await Users.findOneAndRemove({ _id: req.params.id })
      if(!user){
        return res.status(404).json({ message: "L'user n'a pas été trouvé" });
      }
    res.status(201).json("L'enseignant a été bien supprimé")
  } catch (error) {
    res.status(401).json({error : error.message})
  }
}