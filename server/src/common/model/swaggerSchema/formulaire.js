const { array } = require("joi");

module.exports = {
  formulaire: {
    type: "object",
    properties: {
      id_form: {
        type: "string",
        description: "Identifiant de formulaire unique",
      },
      raison_sociale: {
        type: "string",
        default: "null",
        description: "Raison social de l'entreprise",
      },
      siret: {
        type: "string",
        default: "null",
        description: "Numéro SIRET de l'entreprise",
      },
      adresse: {
        type: "string",
        default: "null",
        description: "Adresse de l'entreprise",
      },
      geo_coordonnees: {
        type: "string",
        default: "null",
        description: "Longitude/Latitude de l'adresse de l'entreprise ",
      },
      nom: {
        type: "string",
        default: "null",
        description: "Nom du contact",
      },
      prenom: {
        type: "string",
        default: "null",
        description: "Prénom du contact",
      },
      telephone: {
        type: "string",
        default: "null",
        description: "Téléphone du contact",
      },
      email: {
        type: "string",
        default: "null",
        description: "Email du contact",
      },
      offres: {
        type: array,
        description: "Liste des offres d'apprentissage",
        properties: {
          libelle: { type: "string", description: "Libellé du métier concerné" },
          niveau: {
            type: "string",
            // default: "null",
            description: "Niveau de formation requis",
          },
          date_debut_apprentissage: {
            type: "string",
            // default: "null",
            description: "Date de début de l'apprentissage",
          },
          description: {
            type: "string",
            // default: "null",
            description: "Description de l'offre d'apprentissage",
          },
          romes: {
            type: array,
            properties: "string",
            description: "Liste des romes lié au métier",
          },
          date_creation: {
            type: "string",
            // default: "null",
            description: "Date de creation de l'offre",
          },
          date_expiration: {
            type: "string",
            // default: "null",
            description: "Date d'expiration de l'offre",
          },
          relance_mail_sent: {
            type: "boolean",
            default: "false",
            description: "Statut de l'envoie du mail de relance avant expiration",
          },
          statut: {
            type: "string",
            default: "Active",
            enum: ["Active", "Annulée", "Pourvue"],
            description: "Statut de l'offre",
          },
        },
      },
      mailing: {
        type: array,
        // default: {},
        description: "Liste des évènements MAIL",
        properties: {
          campagne: {
            type: "string",
            default: "string",
            description: "Identifiant de campagne",
          },
          messageId: {
            type: "string",
            default: "string",
            description: "Identifiant sendinblue",
          },
          code: {
            type: "string",
            default: "string",
            description: "Code erreur sendinblue",
          },
          message: {
            type: "string",
            default: "string",
            description: "Message erreur sendinblue",
          },
        },
      },
      events: {
        type: "array",
        // default: "null",
        description: "Liste des évènements sendinblue",
      },
      origine: {
        type: "string",
        // default: "null",
        description: "Origine/organisme lié au formulaire",
      },
    },
  },
};
