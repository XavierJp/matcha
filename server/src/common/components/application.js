const config = require("config");
const axios = require("axios");

module.exports = () => {
  return {
    getApplication: async (offreId) => {
      const result = await axios.get(
        `https://labonnealternance${
          config.MATCHA_ENV === "production" ? "" : "-recette"
        }.apprentissage.beta.gouv.fr/api/application/search`,
        {
          headers: {
            Application: config.lba.application,
            "API-key": config.lba.apiKey,
          },
          params: { query: JSON.stringify({ job_id: offreId }) },
        }
      );

      return result;
    },
  };
};
