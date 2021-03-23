const { Schema } = require("mongoose");
const { nanoid } = require("nanoid");

module.exports = new Schema(
  {
    form_id: {
      type: String,
      default: () => nanoid(),
    },
    raison_social: {
      type: String,
      default: null,
    },
    siret: {
      type: String,
      default: null,
    },
    adresse: {
      type: String,
      default: null,
    },
    coordonnees_geo: {
      type: String,
      default: null,
    },
    ville: {
      type: String,
      default: null,
    },
    nom: {
      type: String,
      default: null,
    },
    prenom: {
      type: String,
      default: null,
    },
    telephone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    offres: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
