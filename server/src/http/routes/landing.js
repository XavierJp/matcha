const express = require("express");
const { Landing } = require("../../common/model");
const tryCatch = require("../middlewares/tryCatchMiddleware");

const requestControl = async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({
      error: true,
      message: "Une erreur est survenue lors de l'envoie du formulaire, aucune données transmises.",
    });
  }

  const exist = await Landing.findOne({ siret: req.body.siret });

  if (exist) {
    return res.status(400).json({ error: true, message: "Une demande a déjà été soumise pour ce numéro siret." });
  }

  next();
};

module.exports = () => {
  const router = express.Router();

  router.post(
    "/cfa",
    requestControl,
    tryCatch(async (req, res) => {
      await Landing.create(req.body);
      return res.sendStatus(200);
    })
  );

  router.post(
    "/entreprise",
    requestControl,
    tryCatch(async (req, res) => {
      await Landing.create(req.body);
      return res.sendStatus(200);
    })
  );

  return router;
};
