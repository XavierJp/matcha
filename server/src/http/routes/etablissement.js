const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ etablissement }) => {
  const router = express.Router();

  /**
   * Get establishment info from SIRET
   */
  router.get(
    "/:siret",
    tryCatch(async (req, res) => {
      const siret = req.params.siret;

      if (!siret) {
        res.status(400).json({ error: true, message: "Le numéro siret est obligatoire" });
      }

      const [tco, referentiel] = await Promise.all([
        etablissement.getEtablissementFromTCO(siret),
        etablissement.getEtablissementFromReferentiel(siret),
      ]);

      if (!referentiel) {
        return res.json(tco.data.etablissements);
      }

      return res.json({ referentiel, tco: tco.data });
    })
  );

  return router;
};
