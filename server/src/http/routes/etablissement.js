const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ etablissement }) => {
  const router = express.Router();

  /**
   * Get establishment info from SIRET
   */
  router.post(
    "/",
    tryCatch(async (req, res) => {
      const siret = req.body.siret;

      if (!siret) {
        res.status(400).json({ error: true, message: "Le numéro siret est obligatoire" });
      }

      const [catalogue, referentiel] = await Promise.all([
        etablissement.getEtablissementFromTCO(siret),
        etablissement.getEtablissementFromReferentiel(siret),
      ]);

      if (!referentiel) {
        return res.json({ ...etablissement.formatTCOData(catalogue.data.etablissements[0]) });
      }

      return res.json({ ...etablissement.formatReferentielData(referentiel.data) });
    })
  );

  return router;
};
