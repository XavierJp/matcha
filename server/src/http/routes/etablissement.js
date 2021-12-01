const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { createUserToken } = require("../../common/utils/jwtUtils");
const { User } = require("../../common/model");

module.exports = ({ etablissement, users, mail }) => {
  const router = express.Router();

  /**
   * Récupérer les informations d'une entreprise à l'aide de l'API du gouvernement
   */
  router.get(
    "/:siret",
    tryCatch(async (req, res) => {
      if (!req.params.siret) {
        return res.status(400).json({ error: true, message: "Le numéro siret est obligatoire." });
      }

      const result = await etablissement.getEtablissementFromGouv(req.params.siret);

      // return res.json(result.data);

      if (!result) {
        return res.status(400).json({ error: true, message: "Le numéro siret est invalide." });
      }

      if (result.data?.etablissement.etat_administratif.value === "F") {
        return res.status(400).json({ error: true, message: "Cette entreprise est considérée comme fermé." });
      }

      if (result.data?.etablissement.naf.startsWith("85")) {
        return res.status(400).json({
          error: true,
          message: "Le numéro siret n'est pas référencé comme une entreprise mais un CFA.",
        });
      }

      let response = etablissement.formatEntrepriseData(result.data.etablissement);

      response.geo_coordonnees = await etablissement.getGeoCoordinates(response.adresse);

      return res.json(response);
    })
  );

  /**
   * Récupération des informations d'un établissement à l'aide des tables de correspondances et du référentiel
   */
  router.post(
    "/",
    tryCatch(async (req, res) => {
      const siret = req.body.siret;

      if (!siret) {
        return res.status(400).json({ error: true, message: "Le numéro siret est obligatoire." });
      }

      const exist = await etablissement.getEtablissement(siret);

      if (exist) {
        return res
          .status(403)
          .json({ error: true, message: "Ce numéro siret est déjà associé à un compte utilisateur Matcha." });
      }

      const [catalogue, referentiel] = await Promise.all([
        etablissement.getEtablissementFromTCO(siret),
        etablissement.getEtablissementFromReferentiel(siret),
      ]);

      if (catalogue?.data?.ferme === true || referentiel?.data?.etat_administratif === "fermé") {
        return res.status(400).json({ error: true, message: "Cette établissement est considérée comme fermé." });
      }

      if (!referentiel && catalogue.data.pagination.total === 0) {
        return res
          .status(400)
          .json({ error: true, message: "Le numéro siret n'est pas référencé comme centre de formation." });
      }

      // return res.json({ referentiel: referentiel?.data, catalogue: catalogue?.data?.etablissements[0] });

      if (!referentiel) {
        return res.json({ ...etablissement.formatTCOData(catalogue.data.etablissements[0]) });
      }

      return res.json({ ...etablissement.formatReferentielData(referentiel.data) });
    })
  );

  /**
   * Enregistrement d'un partenaire
   */

  router.post(
    "/creation",
    tryCatch(async (req, res) => {
      let exist = await users.getUser(req.body.email);

      if (exist) {
        return res.status(403).json({ error: true, message: "L'adresse mail est déjà associé à un compte Matcha." });
      }

      const partenaire = await users.createUser(req.body);

      let { email, raison_sociale, _id } = partenaire;

      const url = etablissement.getValidationUrl(_id);

      const emailBody = mail.getEmailBody({
        email,
        senderName: raison_sociale,
        templateId: 218,
        tags: ["matcha-confirmation-email"],
        params: {
          URL_CONFIRMATION: url,
        },
      });

      await mail.sendmail(emailBody);

      return res.json(partenaire);
    })
  );

  router.post(
    "/validation",
    tryCatch(async (req, res) => {
      const id = req.body.id;

      if (!id) {
        return res.status(400);
      }

      // Validate email
      const validation = await etablissement.validateEtablissementEmail(id);

      if (!validation) {
        return res.status(400).json({
          error: true,
          message: "La validation de l'adresse mail à échoué. Merci de contacter le support Matcha.",
        });
      }

      // Log the user in directly
      const user = await User.findById(req.body.id);
      await users.registerUser(user.email);

      return res.json({ token: createUserToken(user) });
    })
  );

  return router;
};
