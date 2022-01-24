const express = require("express");
const Boom = require("boom");
const { isEmpty } = require("lodash");
const config = require("confing");

const logger = require("../../common/logger");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { getElasticInstance } = require("../../common/esClient");
const { getNestedQueryFilter } = require("../../common/utils/esUtils");

const axios = require("axios");

module.exports = () => {
  const router = new express.Router();

  router.get(
    "/",
    tryCatch(async (req, res) => {
      try {
        const result = await axios.get(
          "https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/application/search",
          {
            headers: {
              Application: config["lba"].application,
              "API-key": config["lba"].apiKey,
            },
            params: { query: JSON.stringify({ job_id: "61e6bd8d09080d002773ff06" }) },
          }
        );

        console.log(result);
        return res.json(result);
      } catch (error) {
        return res.json(error);
      }
    })
  );

  return router;
};
