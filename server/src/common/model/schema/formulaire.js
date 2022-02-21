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
  date_debut_apprentissage: {
    type: Date,
    default: null,
    description: "Date de début de l'apprentissage",
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
  date_creation: {
    type: Date,
    default: null,
    description: "Date de creation de l'offre",
  },
  date_expiration: {
    type: Date,
    default: null,
    description: "Date d'expiration de l'offre",
  },
  date_mise_a_jour: {
    type: Date,
    default: Date.now,
    description: "Date de dernière mise à jour",
  },
  date_derniere_prolongation: {
    type: Date,
    description: "Date de dernière prolongation de l'offre",
  },
  nombre_prolongation: {
    type: Number,
    default: 0,
    description: "Nombre de fois ou l'offre a été prolongé",
  },
  relance_mail_sent: {
    type: Boolean,
    default: false,
    description: "Statut de l'envoie du mail de relance avant expiration",
  },
  statut: {
    type: String,
    default: "Active",
    enum: ["Active", "Annulée", "Pourvue"],
    description: "Statut de l'offre",
  },
  type: {
    type: [String],
    default: "Apprentissage",
    enum: ["Apprentissage", "Professionnalisation"],
    description: "Type de contrat",
  },
  multi_diffuser: {
    type: Boolean,
    default: null,
    description: "Definit si l'offre est diffusé sur d'autre jobboard que Matcha",
  },
  delegate: {
    type: Boolean,
    description: "Definit si l'entreprise souhaite déléger l'offre à un CFA",
  },
});

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
  },
  {
    timestamps: true,
  }
);
