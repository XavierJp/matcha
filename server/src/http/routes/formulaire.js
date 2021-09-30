const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { getElasticInstance } = require("../../common/esClient");
const config = require("config");

const esClient = getElasticInstance();

module.exports = ({ mail, formulaire }) => {
  const router = express.Router();

  /**
   * Query search endpoint
   */
  router.get(
    "/",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const page = qs && qs.page ? qs.page : 1;
      const limit = qs && qs.limit ? parseInt(qs.limit, 10) : 100;

      const result = await formulaire.getFormulaires(query, { page, limit });

      return res.json(result);
    })
  );

  /**
   * Get form from id
   */
  router.get(
    "/:id_form",
    tryCatch(async (req, res) => {
      let result = await formulaire.getFormulaire(req.params.id_form);

      if (!result) {
        return res.sendStatus(401);
      }

      return res.json(result);
    })
  );

  /**
   * Post form
   */
  router.post(
    "/",
    tryCatch(async (req, res) => {
      const response = await formulaire.createFormulaire(req.body);
      let { _id, id_form, raison_sociale, email } = response;

      const mailBody = {
        email,
        senderName: raison_sociale,
        tags: ["matcha-nouveau-formulaire"],
        templateId: 178,
        subject: `Accédez à vos offres déposées sur Matcha`,
        params: {
          URL: `${config.publicUrl}/formulaire/${id_form}`,
        },
      };

      const payload = mail.getEmailBody(mailBody);

      const { body } = await mail.sendmail(payload);

      const result = JSON.parse(body);

      let campagne = "matcha-nouveau-formulaire";
      await mail.logMail(result, campagne, _id);

      return res.json(response);
    })
  );

  /**
   * Put form
   */
  router.put(
    "/:id_form",
    tryCatch(async (req, res) => {
      const result = await formulaire.updateFormulaire(req.params.id_form, req.body);
      return res.json(result);
    })
  );

  /**
   * LBA ENDPOINT : get offer from id
   */
  router.get(
    "/offre/:id_offre",
    tryCatch(async (req, res) => {
      let result = await formulaire.getOffre(req.params.id_offre);

      if (!result) {
        return res.status(400).json({ error: true, message: "Not found" });
      }

      result.offres = result.offres.filter((x) => x._id == req.params.id_offre);

      result.events = undefined;
      result.mailing = undefined;

      return res.json(result);
    })
  );

  /**
   * Post new offer to form
   */

  router.post(
    "/:id_form/offre",
    tryCatch(async (req, res) => {
      const result = await formulaire.createOffre(req.params.id_form, req.body);
      return res.json(result);
    })
  );

  /**
   * Put existing offer from id
   */
  router.put(
    "/offre/:id_offre",
    tryCatch(async (req, res) => {
      const result = await formulaire.updateOffre(req.params.id_offre, req.body);
      return res.json(result);
    })
  );

  /**
   * LBA ENDPOINT
   */
  router.post(
    "/search",
    tryCatch(async (req, res) => {
      const { distance, lat, lon, romes } = req.body;

      if (!distance || !lat || !lon || !romes) {
        return res.status(400).json({ error: "Argument is missing (distance, lat, lon, romes)" });
      }

      const body = {
        query: {
          bool: {
            must: [
              {
                nested: {
                  path: "offres",
                  query: {
                    bool: {
                      must: [
                        {
                          match: {
                            "offres.romes": romes.join(" "),
                          },
                        },
                        {
                          match: {
                            "offres.statut": "Active",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
            filter: [
              {
                geo_distance: {
                  distance: `${distance}km`,
                  geo_coordonnees: {
                    lat,
                    lon,
                  },
                },
              },
            ],
          },
        },
        sort: [
          {
            _geo_distance: {
              geo_coordonnees: {
                lat,
                lon,
              },
              order: "asc",
              unit: "km",
              mode: "min",
              distance_type: "arc",
              ignore_unmapped: true,
            },
          },
        ],
      };

      const result = await esClient.search({ index: "formulaires", body });

      const filtered = result.body.hits.hits.map((x) => {
        let offres = [];

        if (x._source.offres.length === 0) {
          return;
        }

        x._source.mailing = undefined;
        x._source.events = undefined;

        x._source.offres.forEach((o) => {
          if (romes.some((item) => o.romes.includes(item)) && o.statut === "Active") {
            offres.push(o);
          }
        });
        x._source.offres = offres;
        return x;
      });

      return res.json(filtered);
    })
  );

  return router;
};
