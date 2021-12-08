const { Schema } = require("mongoose");

module.exports = new Schema(
  {
    type: {
      type: String,
      enum: ["ENTREPRISE", "CFA"],
      description: "Type d'établissement ayant rempli le formulaire",
    },
    siret: {
      type: String,
      description: "Numéro Siret de l'établissement",
    },
    email: {
      type: String,
      description: "Email de la personne ayant rempli le formulaire",
    },
    metiers: {
      type: Array,
      description: "Liste des métiers sur lesquels l'entreprise souhaite trouver des alternants",
    },
  },
  { timestamps: true }
);
