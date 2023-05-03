// Package pour crypter le mot de passe 
const bcrypt = require("bcrypt");
const Users = require("../../models/Users");

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
        
        // Mettre à jour le mot de passe
        user.password = req.body.newPassword
        // Sauvegarder les modifications dans la BDD
        const updatedPassword = await user.save();
        res.status(200).json({ message: "Le mot a été bien modifié" });
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}