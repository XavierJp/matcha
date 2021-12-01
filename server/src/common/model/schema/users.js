const { Schema } = require("mongoose");

module.exports = new Schema(
  {
    nom: {
      type: String,
      description: "Nom de l'utilisateur",
    },
    prenom: { type: String, description: "Prénom de l'utilisateur" },
    organization: {
      type: String,
      default: null,
      description: "Organisme de l'utilisateur",
    },
    raison_sociale: {
      type: String,
      description: "Raison social de l'établissement",
    },
    siret: {
      type: String,
      description: "Siret de l'établissement",
    },
    adresse: {
      type: String,
      description: "Adresse de l'établissement",
    },
    uai: {
      type: Array,
      description: "Numéro uai de l'établissement",
    },
    geo_coordonnees: {
      type: String,
      default: null,
      description: "Latitude/Longitude de l'adresse de l'entreprise",
    },
    telephone: {
      type: String,
      description: "Téléphone de l'établissement",
    },
    email: {
      type: String,
      default: null,
      description: "L'email de l'utilisateur",
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      description: "true si l'utilisateur est administrateur",
    },
    scope: {
      type: String,
      default: null,
      description: "Scope accessible par l'utilisateur",
    },
    email_valide: {
      type: Boolean,
      default: false,
      description: "Indicateur de confirmation de l'adresse mail par l'utilisateur",
    },
    type: {
      type: String,
      enum: ["ENTREPRISE", "CFA", "OPCO"],
      description: "Type d'utilisateur",
    },
    id_form: {
      type: String,
      description: "Si l'utilisateur est une entreprise, l'objet doit contenir un identifiant de formulaire unique",
    },
    last_connection: {
      type: Date,
      default: null,
      description: "Date de dernière connexion",
    },
  },
  {
    timestamps: true,
  }
);
