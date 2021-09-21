const generator = require("generate-password");
const { Schema } = require("mongoose");

const parameters = {
  length: 50,
  strict: true,
  numbers: true,
  symbols: true,
  lowercase: true,
  uppercase: false,
  exclude: '!"_%£$€*¨^=+~ß(){}[]§;,./:`@#&|<>?"',
  excludeSimilarCharacters: true,
};

module.exports = new Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      default: () => `mna-${generator.generate(parameters)}`,
      index: true,
      required: true,
    },
  },
  { timestamps: true }
);
