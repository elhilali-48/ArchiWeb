const Enseignant = require("../../models/Enseignant");
const Etudiant = require("../../models/Etudiant");
const bcrypt = require("bcrypt");
const Projet = require("../../models/Projet");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const { json } = require("body-parser");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image/projet");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ------------------ Liste des fonctionnalités pour le projet

// ---------------------Ajouter un projet --------------------------------

module.exports.createProjet = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        res.status(500).json({ status: res.statusCode, error: err.message });
      } else {
        // Récuperer l'id de l'enseignant
        const file = req.file;
        const enseignantId = await Enseignant.findOne({
          user_id: req.body.enseignant_id,
        });
        // Ajouter dans la table Porjet
        const projet = await Projet.create({
          titre: req.body.titre,
          description: req.body.description,
          enseignant_id: enseignantId._id,
          competence_acquis: JSON.parse(req.body.competence_acquis),
          competence_requis: JSON.parse(req.body.competence_requis),
          status: req.body.status,
          imagePath: file ? file.filename : "default.webp",
        });

        if (projet) {
          // Ajouter l'id du projet dans la table Enseignant
          const enseignant = await Enseignant.updateOne(
            { user_id: req.body.enseignant_id },
            { $push: { projetsCrees: projet._id } }
          );
          if (enseignant) {
            res.status(200).json({
              status: res.statusCode,
              message: "Projet ajouté avec success",
            });
          } else {
            res.status(401).json({
              status: res.statusCode,
              error: "Erreur dans l'update de l'enseignant",
            });
          }
        } else {
          res.status(401).json({
            status: res.statusCode,
            error: "Erreur dans l'ajout du projet",
          });
        }
      }
    });
  } catch (err) {
    res.status(500).json({ status: res.statusCode, error: err.message });
  }
};

// ----------------------------- Supprimer un projet ----------------------------------

module.exports.deleteProjet = async (req, res) => {
  try {
    const projett = await Projet.findById(req.params.id);
    // Supprimer le projet dans la table Projet
    const projet = await Projet.deleteOne({ _id: req.params.id });

    // Supprimer l'id du projet dans la table enseignant (ProjetCrees)

    if (projet) {
      const enseignant = await Enseignant.updateOne(
        { _id: projett.enseignant_id },
        { $pull: { projetsCrees: req.params.id } }
      );

      if (enseignant) {
        if(projett.imagePath != "default.webp"){
          fs.unlink(`public/image/projet/${projett.imagePath}`, (err) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .json({ error: "Erreur lors de la suppression du fichier" });
            }
           
          }); 
        }
        res
          .status(200)
          .json({ status: res.statusCode, message: "Projet Supprimer" });
      }
    } else {
      res.status(401).json({
        status: res.status,
        error: "Erreur dans la suppression dans la table Projet",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });
  }
};

//  ----------------------------- Archiver un projet ------------------------------

module.exports.archiveProjet = async (req, res) => {
  try {
    const projet = await Projet.updateOne(
      { _id: req.params.id },
      { status: "Archivé" }
    );
    if (projet) {
      res.status(200).json({
        status: res.statusCode,
        message: "Le projet est archivé avec succées",
      });
    } else {
      res
        .status(401)
        .json({ status: res.statusCode, erreur: "Projet est introuvable" });
    }
  } catch (error) {
    res.status(401).json({ status: res.statusCode, erreur: error.message });
  }
};

// ------------------------------- Récupérer tous les projets --------------------------

module.exports.getAllProjets = async (req, res) => {
  try {
    const totalRecords = await Projet.countDocuments();

    const dataTablesParams = req.query; // Récupérer les paramètres envoyés par DataTables

    // Définir vos filtres de recherche ici
    let filters;
    // Appliquer les paramètres de recherche de DataTables
    if (dataTablesParams.search && dataTablesParams.search.value) {
      const searchValue = dataTablesParams.search.value;
      const searchRegex = new RegExp(searchValue, "i");
      filters.$or = [{ titre: searchRegex }];
    }

    const filteredRecords = await Projet.countDocuments(filters);

    const projets = await Projet.find(filters)
      .populate("enseignant_id")
      .skip(dataTablesParams.start)
      .limit(dataTablesParams.length);

    res.status(200).json({
      status: res.statusCode,
      data: projets,
      recordsTotal: totalRecords,
      recordsFiltered: filteredRecords,
    });
  } catch (error) {
    res.status(500).json({ status: res.statusCode, message: error.message });
  }
};

//----------------------------------Récupérer les projets d'un seul enseignant -----------------

module.exports.getMyProjets = async (req, res) => {
  try {
    const enseignant = await Enseignant.findOne({ user_id: req.query.id });
    if (enseignant) {
      const totalRecords = await Projet.countDocuments({
        enseignant_id: enseignant._id,
      });

      const dataTablesParams = req.query; // Récupérer les paramètres envoyés par DataTables

      // Définir vos filtres de recherche ici
      const filters = { enseignant_id: enseignant._id };
      // Appliquer les paramètres de recherche de DataTables
      if (dataTablesParams.search && dataTablesParams.search.value) {
        const searchValue = dataTablesParams.search.value;
        const searchRegex = new RegExp(searchValue, "i");
        filters.$or = [{ titre: searchRegex }];
      }

      const filteredRecords = await Projet.countDocuments(filters);

      const projets = await Projet.find(filters)
        .populate("enseignant_id")
        .skip(dataTablesParams.start)
        .limit(dataTablesParams.length);

      res.status(200).json({
        status: res.statusCode,
        data: projets,
        recordsTotal: totalRecords,
        recordsFiltered: filteredRecords,
      });
    } else {
      res.status(401).json({
        status: res.statusCode,
        message: "Aucun enseignant correspand à ce Id",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, message: error.message });
  }
};

// ----------------------------- Récupérer un seul projet---------------------------

module.exports.getOneProjets = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id).populate(
      "enseignant_id"
    );

    if (projet) {
      res.status(200).json({ status: res.statusCode, projet });
    } else {
      res.status(401).json({
        status: res.statusCode,
        message: "Aucun projet correspand à ce Id",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });
  }
};

// ---------------------------------------------- Modifier un projet ----------------------------------------

module.exports.updateProjet = async (req, res) => {
  try {
    // Chercher le projet
    const projet = await Projet.findById(req.params.id);

    if (projet) {
      projet.titre = req.body.titre;
      projet.description = req.body.description;
      projet.competence_acquis = req.body.competence_acquis;
      projet.competence_requis = req.body.competence_requis;

      const updateProjet = await projet.save();

      res.json(updateProjet);
    } else {
      res.status(401).json({
        status: res.statusCode,
        error: "Aucun projet trouvé avec cet Id",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.stautsCode, error: error.message });
  }
};

// ---------------------------- S'inscrire dans un projet ------------------------------------------

module.exports.inscrire_projet = async (req, res) => {
  try {
    // chercher l'étudiant
    const etudiant = await Etudiant.findOne({ user_id: req.body.id_user });
    if (etudiant) {
      // Chercher le projet
      const projet = await Projet.findById(req.body.id_projet);
      if (projet) {
        let verif = false;
        if (projet.competence_requis.length > 0) {
          verif = projet.competence_requis.every((comp) =>
            etudiant.competences.find((compEtud) => compEtud.nom === comp)
          );
        }
        if (verif || projet.competence_requis.length == 0) {
          // Ajouter l'id du projet dans la collection Etudiant
          etudiant.projetsInscrits.push(req.body.id_projet);
          await etudiant.save();
          // Vérifier si l'étudiant n'est pas déjà inscrit dans le projet
          const resultatsEtudiant = projet.resultatsEtudiants.find(
            (resultat) =>
              resultat.etudiantId.toString() === etudiant._id.toString()
          );
          if (!resultatsEtudiant) {
            // Ajouter l'étudiant dans le tableau resultatsEtudiants du projet
            const nouvelElement = {
              etudiantId: etudiant._id,
              competencesAcquises: [],
              status: "En cours",
            };
  
            // Ajouter les compétences acquises une par une
            for (const competence of projet.competence_acquis) {
              nouvelElement.competencesAcquises.push({
                nom: competence,
                etat: "Non acquise",
                progression: 0,
              });
            }
            projet.resultatsEtudiants.push(nouvelElement);
            await projet.save();
            res.status(200).json({
              status: res.statusCode,
              message: "Vous êtes bien inscrit dans ce projet",
            });
          } else {
            // Modifier le status En cours
            resultatsEtudiant.status = "En cours";
            await projet.save();
            res.status(200).json({
              status: res.statusCode,
              message: "Vous allez reprendre votre projet",
            });
          }
        } else {
          res.status(202).json({
            status: res.statusCode,
            message:
              "Vous ne pouvez pas vous inscrire dans ce projet. Vous n'avez pas tous les prérequis.",
          });
        }
      } else {
        res.status(404).json({
          status: res.statusCode,
          error: "Aucun Projet trouvé avec cet Id",
        });
      }
    } else {
      res.status(404).json({
        status: res.statusCode,
        error: "Aucun Etudiant trouvé avec cet Id",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });
  }
  
};

// ----------------------------- Se désabonner d'un projet ----------------------------------

module.exports.abandonner = async (req, res) => {
  try {
    // Chercher l'id de l'étudiant
    const etudiant = await Etudiant.findOne({ user_id: req.body.id_user });
    if (etudiant) {
      // Chercher le projet
      const projet = await Projet.findById(req.body.id_projet);
      if (projet) {
        // Supprimer l'id du projet dans la table Etudiant
        etudiant.projetsInscrits.pull(req.body.id_projet);

        // Changer le status du projet dans la collection Projet
        const resultatsEtudiant = projet.resultatsEtudiants.find(
          (resultat) =>
            resultat.etudiantId.toString() === etudiant._id.toString()
        );
        if (resultatsEtudiant) {
          resultatsEtudiant.status = "Abandonné";
          await projet.save();
          await etudiant.save();

          res.status(200).json({
            status: res.statusCode,
            message: "Vous avez abandonné ce projet ",
          });
        } else {
          res.status(401).json({
            status: res.statusCode,
            error: "Aucun résultat trouvé pour cet étudiant dans le projet",
          });
        }
      } else {
        res.status(401).json({
          status: res.statusCode,
          error: "Aucun Projet trouvé avec cet ID",
        });
      }
    } else {
      res.status(401).json({
        status: res.statusCode,
        error: "Aucun Etudiant trouvé avec cet ID",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });
  }
};

// --------------------------------- Récupérer la liste des projets ------------------------------------------------------

module.exports.mesProjets = async (req, res) => {
  try {
    // Chercher l'étudiant s'il existe
    const etudiant = await Etudiant.findOne({ user_id: req.params.id });

    if (etudiant) {
      const projets = await Projet.aggregate([
        { $unwind: "$resultatsEtudiants" },
        { $match: { "resultatsEtudiants.etudiantId": etudiant._id } },
      ]);

      if (projets.length === 0) {
        console.log("Aucun projet trouvé avec cet étudiant");
      } else {
        projets.forEach((projet) => {
          console.log("Étudiant trouvé dans le projet", projet.titre);
        });
      }
      res.status(200).json({ status: res.statusCode, data: projets });
    } else {
      res.status(401).json({
        status: res.statusCode,
        error: "Aucun étudiant trouvé avec cet ID",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });
  }
};

// -------------------------- Récupérer les informations d'un seule projet pour un étudiant -------------------------------

module.exports.getInfoEtudiantProjet = async (req, res) => {
  try {
    // Chercher l'étudiant s'il existe
    const etudiant = await Etudiant.findOne({ user_id: req.params.id_user });

    if (etudiant) {
      const projetId = req.params.id_projet; // Récupérer l'ID du projet depuis les paramètres de requête

      const projets = await Projet.aggregate([
        {
          $unwind: "$resultatsEtudiants",
        },
        {
          $match: {
            "resultatsEtudiants.etudiantId": etudiant._id,
            //_id: projetId,
          },
        },
        {
          $lookup: {
            from: "enseignants", // Remplacez 'enseignants' par le nom de votre collection d'enseignants
            localField: "enseignant_id",
            foreignField: "_id",
            as: "enseignant",
          },
        },
      ]);

      if (projets.length === 0) {
        console.log(
          "Aucun projet trouvé avec cet étudiant et cet ID de projet"
        );
      } else {
        projets.forEach((projet) => {
          console.log("Étudiant trouvé dans le projet", projet.titre);
        });
      }

      res.status(200).json({ status: res.statusCode, data: projets });
    } else {
      res.status(401).json({
        status: res.statusCode,
        error: "Aucun étudiant trouvé avec cet ID",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });
  }
};

// ------------------------------ Changer le status d'une competence d'un projet-------------------------------------

module.exports.changerStatus = async (req, res) => {
  try {
    // Chercher l'id de l'étudiant
    const etudiant = await Etudiant.findOne({ user_id: req.body.id_user });
    if (etudiant) {
      // Chercher le projet
      const projet = await Projet.findById(req.body.id_projet);
      if (projet) {
        // Changer le statut de la compétence dans la collection Projet
        const resultatsEtudiant = projet.resultatsEtudiants.find(
          (resultat) =>
            resultat.etudiantId.toString() === etudiant._id.toString()
        );
        if (resultatsEtudiant) {
          const competence = resultatsEtudiant.competencesAcquises.find(
            (comp) => comp._id.toString() === req.body.id_comp.toString()
          );
          if (competence) {
            if (req.body.status) {
              if (req.body.status == "Acquise") {
                competence.etat = "Acquise";
                competence.progression = 100;
              } else if (req.body.status == "Non acquise") {
                competence.etat = "Non acquise";
                competence.progression = 0;
              } else {
                competence.etat = "En cours d'acquisition";
                competence.progression = 20;
              }
            }
            if (req.body.progress) {
              if (req.body.progress == 0) {
                competence.etat = "Non acquise";
                competence.progression = 0;
              } else if (req.body.progress > 0 && req.body.progress < 100) {
                competence.etat = "En cours d'acquisition";
                competence.progression = req.body.progress;
              } else {
                competence.etat = "Acquise";
                competence.progression = 100;
              }
            }

            await projet.save();
            res
              .status(200)
              .json({
                status: res.statusCode,
                message: "Le statut de la compétence a été modifié avec succès",
              });
          } else {
            res
              .status(401)
              .json({
                status: res.statusCode,
                error: "Aucune compétence trouvée avec cet ID",
              });
          }
        } else {
          res
            .status(401)
            .json({
              status: res.statusCode,
              error: "Aucun résultat trouvé pour cet étudiant dans le projet",
            });
        }
      } else {
        res
          .status(401)
          .json({
            status: res.statusCode,
            error: "Aucun Projet trouvé avec cet ID",
          });
      }
    } else {
      res
        .status(401)
        .json({
          status: res.statusCode,
          error: "Aucun Etudiant trouvé avec cet ID",
        });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });
  }
};

// ------------------------------ Terminer (Cloturer le projet)--------------------------------------------------

module.exports.cloturerProjet = async (req, res) => {
  try {
    // Chercher l'id de l'étudiant
    const etudiant = await Etudiant.findOne({ user_id: req.body.id_user });
    if (etudiant) {
      // Chercher le projet
      const projet = await Projet.findById(req.body.id_projet);
      if (projet) {
        // Changer le status du projet dans la collection Projet
        const resultatsEtudiant = projet.resultatsEtudiants.find(
          (resultat) =>
            resultat.etudiantId.toString() === etudiant._id.toString()
        );
        if (resultatsEtudiant) {
          resultatsEtudiant.status = "Terminé";
          await projet.save();
          projet.competence_acquis.forEach((element) => {
            etudiant.competences.push({
              nom: element,
            });
          });
          await etudiant.save();
          res.status(200).json({
            status: res.statusCode,
            message: "Vous avez terminé le projet ",
          });
        } else {
          res.status(401).json({
            status: res.statusCode,
            error: "Aucun résultat trouvé pour cet étudiant dans le projet",
          });
        }
      } else {
        res.status(401).json({
          status: res.statusCode,
          error: "Aucun Projet trouvé avec cet ID",
        });
      }
    } else {
      res.status(401).json({
        status: res.statusCode,
        error: "Aucun Etudiant trouvé avec cet ID",
      });
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });
  }
};


// Fonctionnalté pour un administrateur => Afficher les résultats des étudiantsv ------------------

module.exports.afficherResultsEtudiant = async(req,res)=>{
  try {
    // Cherhcher le projet 
    const projet = await Projet.findById(req.body.id_projet).populate('resultatsEtudiants.etudiantId')
    if(projet){
      res.status(200).json({status: res.statusCode, data : projet})
    }else{
      res.status(401).json({status : res.statusCode,error : "Auncun Projet trouvé avec ce id"});
    }
  } catch (error) {
    res.status(500).json({ status: res.statusCode, error: error.message });

  }
}