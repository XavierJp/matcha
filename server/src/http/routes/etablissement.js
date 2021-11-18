const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { createUserToken } = require("../../common/utils/jwtUtils");
const { User } = require("../../common/model");

module.exports = ({ etablissement, users, mail }) => {
  const router = express.Router();

  /**
   * Récupération des informations de l'établissement à partir du SIRET
   */
  router.post(
    "/",
    tryCatch(async (req, res) => {
      const siret = req.body.siret;

      if (!siret) {
        return res.status(400).json({ error: true, message: "Le numéro siret est obligatoire" });
      }

      const exist = await etablissement.getEtablissement(siret);

      if (exist) {
        return res
          .status(403)
          .json({ error: true, message: "Ce numéro siret est déjà associé à un compte utilisateur Matcha" });
      }

      const [catalogue, referentiel] = await Promise.all([
        etablissement.getEtablissementFromTCO(siret),
        etablissement.getEtablissementFromReferentiel(siret),
      ]);

      if (!referentiel && catalogue.data.pagination.total === 0) {
        return res
          .status(400)
          .json({ error: true, message: "Le numéro siret n'est pas référencé comme centre de formation" });
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
        return res.status(403).json({ error: true, message: "L'adresse mail est déjà associé à un compte Matcha" });
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
          message: "La validation de l'adresse mail à échoué. Merci de contacter le support Matcha",
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
