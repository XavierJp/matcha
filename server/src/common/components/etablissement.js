const axios = require("axios");
const config = require("config");
const { etat_etablissements } = require("../constants");
const { User } = require("../model");

const apiParams = {
  token: config.apiEntreprise,
  context: "Matcha MNA",
  recipient: "12000101100010", // Siret Dinum
  object: "Consolidation des données",
};

module.exports = () => {
  return {
    getEtablissement: (siret) => User.findOne({ siret }),
    getValidationUrl: (_id) => `${config.publicUrl}/authentification/validation/${_id}`,
    validateEtablissementEmail: async (_id) => {
      let exist = await User.findById(_id);

      if (!exist) {
        return false;
      }

      await User.findByIdAndUpdate(_id, { email_valide: true });

      return true;
    },
    getEtablissementFromGouv: (siret) =>
      axios.get(`https://entreprise.api.gouv.fr/v2/etablissements/${siret}`, {
        params: apiParams,
      }),
    getEtablissementFromReferentiel: async (siret) => {
      try {
        const response = await axios.get(
          `https://referentiel.apprentissage.beta.gouv.fr/api/v1/etablissements/${siret}`
        );
        return response;
      } catch (error) {
        if (error.response.status === 404) {
          return null;
        }
      }
    },
    getEtablissementFromTCO: (siret) =>
      axios.get("https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1/entity/etablissements/", {
        params: {
          query: { siret },
        },
      }),

    formatReferentielData: (d) => ({
      etat: d.etat_administratif,
      siret: d.siret,
      uai: d.uai,
      raison_sociale: d.raison_sociale,
      contacts: d.contacts,
      adresse: d.adresse.label,
      commune: d.adresse.localite,
      code_postal: d.adresse.code_postal,
      geo_coordonnees: `${d.adresse.geojson?.geometry.coordinates[0]},${d.adresse.geojson?.geometry.coordinates[0]}`,
    }),
    formatTCOData: (d) => ({
      etat: d.ferme === false ? etat_etablissements.FERME : etat_etablissements.ACTIF,
      siret: d.siret,
      uai: d.uai,
      raison_sociale: d.entreprise_raison_sociale,
      contacts: [], // les tco n'ont pas d'information de contact, mais conserve un standard pour l'ui,
      commune: d.localite,
      code_postal: d.code_postal,
      adresse: `${d.numero_voie === null ? "" : d.numero_voie} ${d.type_voie} ${d.nom_voie}, ${d.code_postal} ${
        d.localite
      }`,
      geo_coordonnees: d.geo_coordonnees,
    }),
  };
};
