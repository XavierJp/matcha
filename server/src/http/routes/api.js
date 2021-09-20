const express = require("express");
const Joi = require("joi");
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

module.exports = ({ formulaire }) => {
  const router = express.Router();

  const formulaireValidationSchema = Joi.object({
    raison_sociale: Joi.string().required(),
    siret: Joi.string().length(14).required(),
    adresse: Joi.string().required(),
    coordonnees_geo: Joi.string()
      .regex(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/)
      .required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    email: Joi.string().email().required(),
    telephone: Joi.string()
      .length(10)
      .regex(/^[0-9]*$/)
      .required(),
  });

  const offreValidationSchema = Joi.object({
    libelle: Joi.string().required(),
    niveau: Joi.string().required(),
    date_debut_apprentissage: Joi.date().required(),
    romes: Joi.array().items(Joi.string()).required(),
    description: Joi.string(),
  });

  /**
   * @swagger
   * "/":
   *  get:
   *    summary: Permet de récupérer l'ensemble des formulaires
   *    tags:
   *     - Formulaire
   *    description:
   *       Permet de récupérer les formulaires correspondant aux critères de filtrage <br/><br/>
   *       Le champ Query est une query Mongo stringify<br/><br/>
   *       **Pour definir vos critères de recherche veuillez regarder le schéma de la collection formulaire (en bas de cette page)**
   *    parameters:
   *       - in: query
   *         name: payload
   *         required: false
   *         schema:
   *           type: object
   *           required:
   *             - query
   *           properties:
   *             query:
   *               type: string
   *               example: '"{\"siret\": \"40022106235476\"}"'
   *    responses:
   *      200:
   *        description: une tableau contenant l'ensemble des formulaires
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */

  router.get(
    "/",
    tryCatch(async (req, res) => {
      let qs = req.query;
      const query = qs && qs.query ? JSON.parse(qs.query) : {};
      const page = qs && qs.page ? qs.page : 1;
      const limit = qs && qs.limit ? parseInt(qs.limit, 10) : 100;

      const response = await formulaire.getFormulaires(query, { page, limit });

      return res.json(response);
    })
  );

  /**
   * @swagger
   * "/:formulaireId":
   *  get:
   *    summary: Permet de récupérer un formulaire à partir de son identifiant
   *    tags:
   *     - Formulaire
   *    parameters:
   *       - in: id_form
   *         name: id_form
   *         required: true
   *         schema:
   *           type: string
   *           required:
   *             - id_form
   *           properties:
   *             id_form:
   *               type: string
   *               example: '40022106235476'
   *    responses:
   *      200:
   *        description: un objet contenant le formulaire
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */
  router.get(
    "/:formulaireId",
    tryCatch(async (req, res) => {
      const response = await formulaire.getFormulaire(req.params.formulaireId);
      return res.json(response);
    })
  );

  /**
   * @swagger
   * "/offre/:offreId":
   *  get:
   *    summary: Permet de récupérer une offre à partir de son identifiant mongoDB
   *    tags:
   *     - Offre
   *    parameters:
   *       - in: id
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           required:
   *             - id
   *           properties:
   *             id:
   *               type: string
   *               example: '60646425184afd00e017c188'
   *    responses:
   *      200:
   *        description: un objet contenant le formulaire dont l'offre est recherché
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */
  router.get(
    "/offre/:offreId",
    tryCatch(async (req, res) => {
      const response = await formulaire.getOffre(req.params.offreId);
      return res.json(response);
    })
  );

  /**
   * @swagger
   * "/":
   *  post:
   *    summary: Permet de créer un nouveau formulaire
   *    tags:
   *     - Formulaire
   *    parameters:
   *       - in: object
   *         name: payload
   *         required: true
   *         schema:
   *              $ref: "#/components/schemas/formulaire"
   *    responses:
   *      200:
   *        description: un objet contenant le formulaire créé
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */
  router.post(
    "/",
    tryCatch(async (req, res) => {
      const { error } = formulaireValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ status: "INPUT_VALIDATION_ERROR", message: error.message });
      }

      const response = await formulaire.updateFormulaire(req.body);
      return res.json(response);
    })
  );

  /**
   * @swagger
   * "/:formulaireId/offre":
   *  post:
   *    summary: Permet de créer une offre pour un formulaire donné
   *    tags:
   *     - Offre
   *    requestBody:
   *       description: L'objet JSON de l'offre
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *           $ref: "#/components/schemas/offre"
   *    responses:
   *      200:
   *        description: un objet contenant le formulaire dont l'offre a été créé
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */
  router.post(
    "/:formulaireId/offre",
    tryCatch(async (req, res) => {
      const exist = await formulaire.getFormulaire(req.params.formulaireId);

      if (!exist) {
        return res.status(400).json({ status: "INVALID_RESSOURCE", message: "Form does not exist" });
      }

      const { error } = offreValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ status: "INPUT_VALIDATION_ERROR", message: error.message });
      }

      const response = await formulaire.createOffre(req.params.formulaireId, req.body);

      return res.json(response);
    })
  );

  /**
   * @swagger
   * "/:formulaireId":
   *  patch:
   *    summary: Permet de modifier un formulaire
   *    tags:
   *     - Formulaire
   *    requestBody:
   *       description: L'objet JSON du formulaire
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *           $ref: "#/components/schemas/formulaire"
   *    responses:
   *      200:
   *        description: un objet contenant le formulaire modifié
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */
  router.patch(
    "/:formulaireId",
    tryCatch(async (req, res) => {
      const exist = await formulaire.getFormulaire(req.params.formulaireId);

      if (!exist) {
        return res.status(400).json({ status: "INVALID_RESSOURCE", message: "Formulaire does not exist" });
      }

      const { error } = formulaireValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ status: "INPUT_VALIDATION_ERROR", message: error.message });
      }

      const response = formulaire.updateFormulaire(req.params.formulaireId, req.body);

      return res.json(response);
    })
  );
  /**
   * @swagger
   * "/:formulaireId/offre/:offreId":
   *  patch:
   *    summary: Permet de modifier une offre pour un formulaire donné
   *    tags:
   *     - Offre
   *    requestBody:
   *       description: L'objet JSON de l'offre
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *           $ref: "#/components/schemas/offre"
   *    responses:
   *      200:
   *        description: un objet contenant le formulaire dont l'offre a été modifié
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */
  router.patch(
    "/:formulaireId/offre/:offreId",
    tryCatch(async (req, res) => {
      const checkFormulaire = await formulaire.getFormulaire(req.params.formulaireId);

      if (!checkFormulaire) {
        return res.status(400).json({ status: "INVALID_RESSOURCE", message: "Form does not exist" });
      }

      const checkOffre = await formulaire.getOffre(req.params.offreId);

      if (!checkOffre) {
        return res.status(400).json({ status: "INVALID_RESSOURCE", message: "Offer does not exist" });
      }

      const { error } = formulaireValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ status: "INPUT_VALIDATION_ERROR", message: error.message });
      }

      const response = formulaire.updateOffre(req.params.offreId, req.body);

      return res.json(response);
    })
  );

  /**
   * @swagger
   * "/offre/:offreId/cancel":
   *  put:
   *    summary: Permet de mettre à jour une offre au statut **Annulée**
   *    tags:
   *     - Offre
   *    responses:
   *      200:
   *        description: le statut 200 (Success)
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
   * @swagger
   * "/offre/:offreId/provided":
   *  put:
   *    summary: Permet de mettre à jour une offre au statut **Pourvue**
   *    tags:
   *     - Offre
   *    responses:
   *      200:
   *        description: le statut 200 (Success)
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

  return router;
};
