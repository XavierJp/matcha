const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { getElasticInstance } = require("../../common/esClient");
const config = require("config");
const { User } = require("../../common/model");
const esClient = getElasticInstance();

module.exports = ({ formulaire, mail, etablissement, application, users }) => {
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

      await Promise.all(
        result.offres.map(async (offre) => {
          let candidatures = await application.getApplication(offre._id);
          offre.candidatures = candidatures.data.data.length > 0 ? candidatures.data.data.length : undefined;

          return offre;
        })
      );

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
      /** 
       * 20/12/2021 : mise en commentaire car l'accès est impossible depuis l'URL seul, il faut être authentifié.
       * 
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
      */

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
      let cfa = {};

      if (!result) {
        return res.status(400).json({ error: true, message: "Not found" });
      }

      result.offres = result.offres.filter((x) => x._id == req.params.id_offre);

      if (result.mandataire === true) {
        cfa = await etablissement.getEtablissement({ siret: result.gestionnaire });

        result.telephone = cfa.telephone;
        result.email = cfa.email;
        result.nom = cfa.nom;
        result.prenom = cfa.prenom;
        result.raison_sociale = cfa.raison_sociale;
        result.adresse = cfa.adresse;
      }

      result.events = undefined;
      result.mailing = undefined;

      return res.json(result);
    })
  );

  /**
   * Create new offer
   */

  router.post(
    "/:id_form/offre",
    tryCatch(async (req, res) => {
      const result = await formulaire.createOffre(req.params.id_form, req.body);

      let { email, raison_sociale, prenom, nom, mandataire, gestionnaire, offres } = result;
      let offre = req.body;
      let contactCFA;

      offre._id = result.offres.filter((x) => x.libelle === offre.libelle)[0]._id;

      offre.supprimer = `${config.publicUrl}/offre/${offre._id}/cancel`;
      offre.pourvue = `${config.publicUrl}/offre/${offre._id}/provided`;

      // if first offer creation for an Entreprise, send specific mail
      if (offres.length === 1 && mandataire === false) {
        // Get user account
        const user = await users.getUser({ email });
        // Get user account validation link
        const url = etablissement.getValidationUrl(user._id);

        const body = mail.getEmailBody({
          email,
          senderName: raison_sociale,
          templateId: 241,
          tags: ["matcha-nouveau-depot-simplifie"],
          params: {
            PRENOM: prenom,
            NOM: nom,
            CONFIRMATION_URL: url,
            OFFRES: [offre],
          },
        });

        await mail.sendmail(body);

        return res.json(result);
      }

      // get CFA informations if formulaire is handled by a CFA
      if (result.mandataire) {
        contactCFA = await User.findOne({ siret: gestionnaire });
      }

      // Send mail with action links to manage offers
      const mailBody = {
        email: mandataire ? contactCFA.email : email,
        senderName: mandataire ? `${contactCFA.prenom} ${contactCFA.nom}` : raison_sociale,
        templateId: 231,
        params: {
          PRENOM: mandataire ? contactCFA.prenom : prenom,
          NOM: mandataire ? contactCFA.nom : nom,
          RAISON_SOCIALE: raison_sociale,
          OFFRES: [offre],
          MANDATAIRE: result.mandataire,
          URL_LBA: config.publicUrl.includes("production")
            ? `https://labonnealternance.apprentissage.beta.gouv.fr/recherche-apprentissage?&display=list&page=fiche&type=matcha&itemId=${offre._id}`
            : `https://labonnealternance-recette.apprentissage.beta.gouv.fr/recherche-apprentissage?&display=list&page=fiche&type=matcha&itemId=${offre._id}`,
        },
        subject: mandataire
          ? `Votre offre d'alternance pour ${raison_sociale} a bien été publiée`
          : `Votre offre d'alternance a bien été publiée`,
        tags: ["matcha-nouvelle-offre"],
      };

      const payload = mail.getEmailBody(mailBody);
      await mail.sendmail(payload);

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
   * Permet de passer une offre en statut ANNULER (mail transactionnel)
   */
  router.put(
    "/offre/:offreId/cancel",
    tryCatch(async (req, res) => {
      const exist = formulaire.getOffre(req.params.offreId);

      if (!exist) {
        return res.status(400).json({ status: "INVALID_RESSOURCE", message: "Offre does not exist" });
      }

      await formulaire.cancelOffre(req.params.offreId);

      return res.sendStatus(200);
    })
  );

  /**
   * Permet de passer une offre en statut POURVUE (mail transactionnel)
   */
  router.put(
    "/offre/:offreId/provided",
    tryCatch(async (req, res) => {
      const exist = formulaire.getOffre(req.params.offreId);

      if (!exist) {
        return res.status(400).json({ status: "INVALID_RESSOURCE", message: "Offre does not exist" });
      }

      await formulaire.provideOffre(req.params.offreId);

      return res.sendStatus(200);
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

      const filtered = await Promise.all(
        result.body.hits.hits.map(async (x) => {
          let offres = [];
          let cfa = {};

          if (x._source.offres.length === 0) {
            return;
          }

          x._source.mailing = undefined;
          x._source.events = undefined;

          if (x._source.mandataire === true) {
            cfa = await etablissement.getEtablissement({ siret: x._source.gestionnaire });

            x._source.telephone = cfa.telephone;
            x._source.email = cfa.email;
            x._source.nom = cfa.nom;
            x._source.prenom = cfa.prenom;
            x._source.raison_sociale = cfa.raison_sociale;
            x._source.adresse = cfa.adresse;
          }

          x._source.offres.forEach((o) => {
            if (romes.some((item) => o.romes.includes(item)) && o.statut === "Active") {
              offres.push(o);
            }
          });

          x._source.offres = offres;
          return x;
        })
      );

      return res.json(filtered);
    })
  );

  return router;
};
