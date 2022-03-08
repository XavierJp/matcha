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
    getEtablissement: (query) => User.findOne(query),
    getOpco: (siret) => axios.get(`https://www.cfadock.fr/api/opcos?siret=${siret}`),
    getValidationUrl: (_id) => `${config.publicUrl}/authentification/validation/${_id}`,
    validateEtablissementEmail: async (_id) => {
      let exist = await User.findById(_id);

      if (!exist) {
        return false;
      }

      await User.findByIdAndUpdate(_id, { email_valide: true });

      return true;
    },
    getEtablissementFromGouv: async (siret) => {
      try {
        let response = await axios.get(`https://entreprise.api.gouv.fr/v2/etablissements/${siret}`, {
          params: apiParams,
        });
        return response;
      } catch (error) {
        return false;
      }
    },
    getEtablissementFromReferentiel: async (siret) => {
      try {
        const response = await axios.get(`https://referentiel.apprentissage.beta.gouv.fr/api/v1/organismes/${siret}`);
        return response;
      } catch (error) {
        if (error.response.status === 404) {
          return null;
        }
      }
    },
    getEtablissementFromCatalogue: (siret) =>
      axios.get("https://catalogue.apprentissage.beta.gouv.fr/api/v1/entity/etablissements/", {
        params: {
          query: { siret },
        },
      }),
    getGeoCoordinates: async (adresse) => {
      const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${adresse}`);
      const coordinates = response.data.features[0]
        ? response.data.features[0].geometry.coordinates.reverse().join(",")
        : "NOT FOUND";
      return coordinates;
    },
    formatEntrepriseData: (d) => ({
      etat: d.etat_administratif.value, // F pour fermé ou A pour actif
      siret: d.siret,
      raison_sociale: d.adresse.l1,
      domaine: d.libelle_naf,
      adresse: `${d.adresse.l4 ?? ""} ${d.adresse.code_postal} ${d.adresse.localite}`,
      rue: d.adresse.l4,
      commune: d.adresse.localite,
      code_postal: d.adresse.code_postal,
      contacts: [], // conserve la coherence avec l'UI
    }),
    formatReferentielData: (d) => ({
      etat: d.etat_administratif,
      siret: d.siret,
      uai: d.uai_potentiels.filter((x) => x.valide === true).map((x) => x.uai),
      raison_sociale: d.raison_sociale,
      contacts: d.contacts,
      adresse: d.adresse?.label,
      rue:
        d.adresse?.label?.split(`${d.adresse?.code_postal}`)[0].trim() ||
        d.lieux_de_formation[0].adresse.label.split(`${d.lieux_de_formation[0].adresse.code_postal}`)[0].trim(),
      commune: d.adresse?.localite || d.lieux_de_formation[0].adresse.localite,
      code_postal: d.adresse?.code_postal || d.lieux_de_formation[0].adresse.code_postal,
      geo_coordonnees: d.adresse
        ? `${d.adresse?.geojson.geometry.coordinates[0]},${d.adresse?.geojson.geometry.coordinates[0]}`
        : `${d.lieux_de_formation[0].adresse.geojson?.geometry.coordinates[0]},${d.lieux_de_formation[0].adresse.geojson?.geometry.coordinates[1]}`,
    }),
    formatCatalogueData: (d) => ({
      etat: d.ferme === false ? etat_etablissements.FERME : etat_etablissements.ACTIF,
      siret: d.siret,
      uai: [d.uai],
      raison_sociale: d.entreprise_raison_sociale,
      contacts: [], // les tco n'ont pas d'information de contact, mais conserve un standard pour l'ui,
      commune: d.localite,
      code_postal: d.code_postal,
      adresse: `${d.numero_voie === null ? "" : d.numero_voie} ${d.type_voie} ${d.nom_voie} ${d.code_postal} ${
        d.localite
      }`,
      rue: `${d.numero_voie === null ? "" : d.numero_voie} ${d.type_voie} ${d.nom_voie}`,
      geo_coordonnees: d.geo_coordonnees,
    }),
  };
};
