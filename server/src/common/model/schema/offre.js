const { Schema } = require("mongoose");

module.exports = new Schema({
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
