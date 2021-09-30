module.exports = {
  offre: {
    type: "array",
    default: [],
    items: {
      type: "object",
      properties: {
        libelle: {
          type: "string",
          description: "Libellé du métier concerné selon le référentiel La Bonne Alternance",
          required: true,
        },
        niveau: {
          type: "string",
          description: "Niveau de formation requis",
        },
        date_debut_apprentissage: {
          type: "string",
          description: "Date de début de l'apprentissage",
          required: true,
        },
        description: {
          type: "string",
          description: "Description de l'offre d'apprentissage",
          required: true,
        },
        romes: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Liste des romes lié au métier",
          required: true,
        },
        date_creation: {
          type: "string",
          default: "system",
          description: "Date de creation de l'offre",
        },
        date_expiration: {
          type: "string",
          default: "system",
          description: "Date d'expiration de l'offre",
        },
        relance_mail_sent: {
          type: "boolean",
          default: "system",
          description: "Statut de l'envoie du mail de relance avant expiration",
        },
        statut: {
          type: "string",
          default: "Active",
          enum: ["Active", "Annulée", "Pourvue"],
          description: "Statut de l'offre",
        },
        type: {
          type: "string",
          default: "Apprentissage",
          enum: ["Apprentissage", "Professionnalisation"],
          description: "Type de contrat",
        },
      },
    },
  },
};
