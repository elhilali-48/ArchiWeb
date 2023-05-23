const Administrateur = require("../../models/Administrateur")
// Package pour crypter le mot de passe 
const bcrypt = require("bcrypt");
const Users = require("../../models/Users");

// ----------------- Ajouter un admin ----------------------------

module.exports.CreateAdmin = async(req,res)=>{
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
            role : "Admin"
          })
          
          // Vérifier si user est bien ajouté dans la table Users 
          if(AddUser){
            // Ajouter dans la table Administrateur 
            const admin = await Administrateur.create({
              nom: req.body.nom,
              prenom: req.body.prenom,
              isSuperAdmin: req.body.isAdmin,
              user_id : AddUser._id
            });
            res.status(201).json({ admin });
          }
          else{
            res.status(401).json({ error: 'Erreur' });
          }
          
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

// ----------------- Afficher un Admin ------------------------- 

module.exports.readAdmin = async (req,res)=>{
  try {
    const admin = await Administrateur.findById(req.params.id).populate("user_id");
    if(admin){
      res.status(201).json({admin})
    }else{
      res.status(401).json({error : "Ce admin n'existe pas "});
    }
  } catch (error) {
    res.status(500).json({error});
  }
}


// --------------------- Delete un administrateur ------------------------

module.exports.deleteAdmin = async(req,res)=>{
  try {
    const admin = await Administrateur.findOneAndRemove({ user_id: req.params.id })
      if (!admin) {
        return res.status(404).json({ message: "L'administrateur n'a pas été trouvé" });
      }
      // Supprime également l'enregistrement dans l'autre table
    const user = await Users.findOneAndRemove({ _id: req.params.id })
      if(!user){
        return res.status(404).json({ message: "L'user n'a pas été trouvé" });
      }
    res.status(201).json("L'administrateur a été bien supprimé")
  } catch (error) {
    res.status(401).json({error : error.message})
  }

}


// ------------------------ Modifier un administrateur -----------------------

// Remarque => on modifie nom prenom isSuperAdmin

module.exports.updateAdmin = async(req,res)=>{
  try {
    const admin = await Administrateur.findOneAndUpdate({_id : req.params.id},req.body);
    if(!admin){
      res.status(401).json("Admin est introuvable")
    }
    res.status(201).json('Administrateur est bien modifié')
  } catch (error) {
    res.status(500).json({error : error.message})
  }
}


// Récupere tous les enseignants 

module.exports.getAllEnseignats = async(req,res)=>{
  // try{

  //   const enseignants = await Users.find({role : "Enseignant"});
  //   res.status(200).json({status : res.statusCode, data : enseignants})

  // }catch{
  //   res.status(500).json({status : res.statusCode, message : error.message})
  // }

  try {
    const totalRecords = await Users.countDocuments({ role: req.query.role });

    const dataTablesParams = req.query; // Récupérer les paramètres envoyés par DataTables

    const filters = { role: req.query.role }; // Définir vos filtres de recherche ici

    // Appliquer les paramètres de recherche de DataTables
    if (dataTablesParams.search && dataTablesParams.search.value) {
      const searchValue = dataTablesParams.search.value;
      const searchRegex = new RegExp(searchValue, 'i');
      filters.$or = [
        { email: searchRegex },
      ];
    }

    const filteredRecords = await Users.countDocuments(filters);

    const enseignants = await Users.find(filters)
      .skip(dataTablesParams.start)
      .limit(dataTablesParams.length);

    res.status(200).json({
      status: res.statusCode,
      data: enseignants,
      recordsTotal: totalRecords,
      recordsFiltered: filteredRecords
    });
  } catch (error) {
    res.status(500).json({ status: res.statusCode, message: error.message });
  }
}
