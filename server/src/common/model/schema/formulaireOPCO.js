const { Schema } = require("mongoose");
const { nanoid } = require("nanoid");
const { transactionalSchema } = require("./transactional");

const offresSchema = new Schema({
  libelle: { type: String, default: null, description: "Libellé du métier concerné" },
  niveau: {
    type: String,
    default: null,
    description: "Niveau de formation requis",
  },
  description: {
    type: String,
    default: null,
    description: "Description de l'offre d'apprentissage",
  },
  romes: {
    type: [String],
    default: [],
    description: "Liste des romes lié au métier",
  },
});

module.exports = new Schema(
  {
    id_form: {
      type: String,
      default: () => nanoid(),
      description: "Identifiant de formulaire unique",
    },
    raison_sociale: {
      type: String,
      default: null,
      description: "Raison social de",
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
      description: "Longitude/Latitude de l'adresse de l'entreprise ",
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
  },
  {
    timestamps: true,
  }
);
