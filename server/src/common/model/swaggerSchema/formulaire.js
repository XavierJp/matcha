const { offre } = require("./offre");

module.exports = {
  formulaire: {
    type: "object",
    properties: {
      id_form: {
        type: "string",
        default: "system",
        description: "Identifiant de formulaire unique",
      },
      raison_sociale: {
        type: "string",
        required: true,
        description: "Raison social de l'entreprise",
      },
      siret: {
        type: "string",
        required: true,
        description: "Numéro SIRET de l'entreprise",
      },
      adresse: {
        type: "string",
        required: true,
        description: "Adresse de l'entreprise",
      },
      geo_coordonnees: {
        type: "string",
        required: true,
        description: "Longitude/Latitude de l'adresse de l'entreprise ",
      },
      nom: {
        type: "string",
        required: true,
        description: "Nom du contact",
      },
      prenom: {
        type: "string",
        required: true,
        description: "Prénom du contact",
      },
      telephone: {
        type: "string",
        required: true,
        description: "Téléphone du contact",
      },
      email: {
        type: "string",
        required: true,
        description: "Email du contact",
      },
      // mailing: {
      //   type: array,
      //   description: "Liste des évènements MAIL",
      //   properties: {
      //     campagne: {
      //       type: "string",
      //       default: "string",
      //       description: "Identifiant de campagne",
      //     },
      //     messageId: {
      //       type: "string",
      //       default: "string",
      //       description: "Identifiant sendinblue",
      //     },
      //     code: {
      //       type: "string",
      //       default: "string",
      //       description: "Code erreur sendinblue",
      //     },
      //     message: {
      //       type: "string",
      //       default: "string",
      //       description: "Message erreur sendinblue",
      //     },
      //   },
      // },
      // events: {
      //   type: "array",
      //   description: "Liste des évènements sendinblue",
      // },
      origine: {
        type: "string",
        default: "user based setup",
        description: "Origine/organisme lié au formulaire",
        required: true,
      },
      offres: { required: false, ...offre },
    },
  },
};
