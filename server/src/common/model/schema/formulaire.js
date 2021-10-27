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
    type: String,
    default: "Apprentissage",
    enum: ["Apprentissage", "Professionnalisation"],
    description: "Type de contrat",
  },
  multi_diffuser: {
    type: Boolean,
    default: false,
    description: "Definit si l'offre est diffusé sur d'autre jobboard que Matcha",
  },
});

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
      description: "Longitude/Latitude de l'adresse de l'entreprise ",
    },
    raison_sociale_mandataire: {
      type: String,
      description: "Raison social de l'etablissement mandataire",
    },
    siret_mandataire: {
      type: String,
      description: "Numéro SIRET de l'etablissement mandataire",
    },
    adresse_mandataire: {
      type: String,
      description: "Adresse de l'etablissement mandataire",
    },
    geo_coordonnees_mandataire: {
      type: String,
      description: "Longitude/Latitude de l'adresse de l'etablissement mandataire ",
    },
    mandataire: {
      type: Boolean,
      default: false,
      description: "le formulaire est-il géré par un mandataire ?",
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
  },
  {
    timestamps: true,
  }
);
