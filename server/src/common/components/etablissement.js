const axios = require("axios");
const config = require("config");

const apiParams = {
  token: config.apiEntreprise,
  context: "Matcha MNA",
  recipient: "12000101100010", // Siret Dinum
  object: "Consolidation des données",
};

module.exports = () => {
  return {
    getEtablissementFromGouv: (siret) =>
      axios.get(`https://entreprise.api.gouv.fr/v2/etablissements/${siret}`, {
        params: apiParams,
      }),
    getEtablissementFromReferentiel: async (siret) => {
      try {
        const response = await axios.get(
          `https://referentiel.apprentissage.beta.gouv.fr/api/v1/annuaire/etablissements/${siret}`
        );
        return response;
      } catch (error) {
        if (error.response.status === 404) {
          return null;
        }
      }
    },
    getEtablissementFromTCO: (siret) =>
      axios.get("https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1/entity/etablissements/siret-uai", {
        params: {
          query: { siret },
        },
      }),
  };
};
