const { Schema } = require("mongoose");

module.exports = new Schema(
  {
    campagne: {
      type: String,
      description: "Identifiant de campagne",
    },
    messageId: {
      type: String,
      description: "Identifiant sendinblue",
    },
    code: {
      type: String,
      description: "Code erreur sendinblue",
    },
    message: {
      type: String,
      description: "Message erreur sendinblue",
    },
  },
  {
    timestamps: true,
  }
);
