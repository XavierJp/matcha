const { Schema } = require("mongoose");
const { nanoid } = require("nanoid");
const transactionalSchema = require("./transactional");
const offresSchema = require("./offre");

// const opcoSchema = new Schema(
//   {
//     libelle: {
//       type: String,
//       description: "Nom de l'opco",
//     },
//   },
//   { _id: false }
// );

module.exports = new Schema(
  {
    id_form: {
      type: String,
      default: () => nanoid(),
      description: "Identifiant de formulaire unique",
      index: true,
    },
    raison_sociale: {
      type: String,
      default: null,
      description: "Raison social de l'entreprise",
    },
    siret: {
      type: String,
      default: null,
      description: "Numéro SIRET de l'entreprise",
    },
    adresse: {
      type: String,
      default: null,
      description: "Adresse de l'entreprise",
    },
    geo_coordonnees: {
      type: String,
      default: null,
      description: "Latitude/Longitude (inversion lié à LBA) de l'adresse de l'entreprise",
    },
    mandataire: {
      type: Boolean,
      default: false,
      description: "le formulaire est-il géré par un mandataire ?",
    },
    gestionnaire: {
      type: String,
      description: "Siret de l'organisme de formation gestionnaire des offres de l'entreprise",
    },
    nom: {
      type: String,
      default: null,
      description: "Nom du contact",
    },
    prenom: {
      type: String,
      default: null,
      description: "Prénom du contact",
    },
    telephone: {
      type: String,
      default: null,
      description: "Téléphone du contact",
    },
    email: {
      type: String,
      default: null,
      description: "Email du contact",
    },
    offres: [{ type: offresSchema, default: {}, description: "Liste des offres d'apprentissage" }],
    mailing: [{ type: transactionalSchema, default: {}, description: "Liste des évènements MAIL" }],
    events: {
      type: Array,
      default: null,
      description: "Liste des évènements sendinblue",
    },
    origine: {
      type: String,
      default: null,
      description: "Origine/organisme lié au formulaire",
    },
    opco: {
      type: String,
      description: "Information sur l'opco de l'entreprise",
    },
    statut: {
      type: String,
      enum: ["Actif", "Archivé", "En attente de validation"],
      default: "Actif",
      description: "Statut du formulaire",
    },
  },
  {
    timestamps: true,
  }
);
