const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const logger = require("../../common/logger");
const { getElasticInstance } = require("../../common/esClient");
const Boom = require("boom");
const { isEmpty } = require("lodash");

const esClient = getElasticInstance();

const getNestedQueryFilter = (nested) => {
  const filters = nested.query.bool.must[0].bool.must;

  let filt = filters
    .map((item) => {
      if (item.nested) {
        return item.nested.query.bool.should[0].terms;
      }
    })
    .filter((x) => x !== undefined)
    .reduce((a, b) => Object.assign(a, b), {});

  return filt;
};

module.exports = () => {
  const router = express.Router();

  router.post(
    "/:index/_search",
    tryCatch(async (req, res) => {
      const { index } = req.params;
      logger.info(`Es search ${index}`);
      console.log("QUERY", getNestedQueryFilter(req.body));
      const result = await esClient.search({ index, ...req.query, body: req.body });

      const filters = getNestedQueryFilter(req.body);

      // const QUERY = {
      //   "offres.statut.keyword": ["Annulée"],
      //   "offres.libelle.keyword": ["Mécanique, maintenance industrielle"],
      // };

      if (filters.length === 0 || isEmpty(filters)) {
        return res.json(result.body);
      } else {
        result.body.hits.hits.forEach((x) => {
          let offres = [];

          if (x._source.offres.length === 0) {
            return;
          }

          x._source.mailing = undefined;
          x._source.events = undefined;

          let filterKeys = Object.keys(filters).map((x) => x.split(".")[1]);

          if (filterKeys.includes("statut")) {
            let filteredOffers = x._source.offres.filter(({ statut }) =>
              filters["offres.statut.keyword"].some((f) => statut === f)
            );

            offres.push(...filteredOffers);
          }
          x._source.offres = offres;
        });

        // console.log(result.body);

        return res.json(result.body);
      }

      // return res.json(result.body);
    })
  );

  router.post(
    "/:index/_count",
    tryCatch(async (req, res) => {
      const { index } = req.params;

      const result = await esClient.count({
        index,
        ...req.query,
        body: req.body,
      });

      return res.json(result.body);
    })
  );

  router.post(
    "/:index/_msearch",
    tryCatch(async (req, res) => {
      const { index } = req.params;
      logger.info(`Es Multi search ${index}`);
      const result = await esClient.msearch({ index, ...req.query, body: req.body, rest_total_hits_as_int: true });

      return res.json(result.body);
    })
  );

  router.post(
    "/:index/scroll",
    tryCatch(async (req, res) => {
      const { index } = req.params;
      logger.info(`Es scrool search ${index}`);

      let qs = req.query;

      let scrollId = null;
      if (qs && qs.scroll_id) {
        scrollId = qs.scroll_id;
      }

      if (scrollId) {
        const response = await esClient.scroll({
          scrollId,
          scroll: "1m",
        });
        return res.json(response.body);
      }

      if (!req.body || req.body === "") {
        throw Boom.badImplementation("something went wrong");
      }

      const result = await esClient.search({
        index,
        scroll: "1m",
        size: 100,
        body: req.body,
      });

      return res.json(result.body);
    })
  );

  return router;
};
