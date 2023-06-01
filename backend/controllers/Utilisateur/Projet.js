const Enseignant = require("../../models/Enseignant");
const bcrypt = require("bcrypt");
const Projet = require("../../models/Projet");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require('fs');
const { json } = require("body-parser");

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
        const file = req.file
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
          imagePath : file ? file.filename : "default.webp"
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
        fs.unlink(`public/image/projet/${projett.imagePath}`, (err) => {
          if (err) {
            console.error(err);
             res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
          }
          res
          .status(200)
          .json({ status: res.statusCode, message: "Projet Supprimer" });
        });

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
  // try {
  //     const projets = await Projet.find({}).populate("enseignant_id")
  //     res.status(200).json({status : res.statusCode, projets});
  // } catch (error) {
  //     res.status(500).json({status :res.statusCode,error : error.message});
  // }
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
