const config = require("config");
const axios = require("axios");

module.exports = () => {
  return {
    getApplication: async (offreId) => {
      const result = await axios.get(
        "https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/application/search",
        {
          headers: {
            Application: config["lba"].application,
            "API-key": config["lba"].apiKey,
          },
          params: { query: JSON.stringify({ job_id: { $in: [offreId] } }) },
        }
      );

      return result;
    },
  };
};
