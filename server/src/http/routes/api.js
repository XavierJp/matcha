const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

/**
 * 
GET /api/v1/formulaire/
GET /api/v1/formulaire/:id
GET /api/v1/formulaire/offre/:id
POST /api/v1/formulaire
POST /api/v1/:formulaireId/offre
PATCH /api/v1/formulaire/:id
PATCH /api/v1/:formulaireId/:offreId
DELETE /api/v1/:formulaireId
DELETE /api/v1/:formulaireId/:offreId
 */

module.exports = () => {
  const router = express.Router();

  /**
   * @swagger
   * /formulaire:
   *  get:
   *    summary: Permet de récupérer l'ensemble des formulaires
   *    responses:
   *      200:
   *        description: une tableau contenant l'ensemble des formulaires
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */

  router.get(
    "/formulaire",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  router.get(
    "/formulaire/:formulaireId",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  router.post(
    "/formulaire/offre/:offreId",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  router.post(
    "/formulaire",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  router.post(
    "/formulaire/:formulaireId/offre",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  router.patch(
    "/formulaire/:formulaireId",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  router.patch(
    "/formulaire/:formulaireId/offre/:offreId",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  router.delete(
    "/formulaire/:formulaireId",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  router.delete(
    "/formulaire/:formulaireId/offre/:offreId",
    tryCatch(async (req, res) => {
      const { body } = req;
      return res.json(body);
    })
  );
  return router;
};
