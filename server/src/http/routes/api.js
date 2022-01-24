const express = require("express");
const Joi = require("joi");
const { REGEX } = require("../../common/constants");
const tryCatch = require("../middlewares/tryCatchMiddleware");

/**
 * 
GET /api/v1/formulaire/
GET /api/v1/formulaire/:id
GET /api/v1/formulaire/offre/:id
POST /api/v1/formulaire
POST /api/v1/formulaire/:userId
POST /api/v1/:formulaireId/offre
PATCH /api/v1/formulaire/:id
PATCH /api/v1/:formulaireId/:offreId
DELETE /api/v1/:formulaireId
DELETE /api/v1/:formulaireId/:offreId

GET /api/v1/user/:id
POST /api/v1/user/:id
PATCH /api/v1/user/:id
DELETE /api/v1/user/:id


 */

module.exports = ({ formulaire, etablissement, users }) => {
  const router = express.Router();

  const searchValidationSchema = Joi.object({
    raison_sociale: Joi.string(),
    siret: Joi.string().pattern(REGEX.SIRET),
    adresse: Joi.string(),
    nom: Joi.string(),
    prenom: Joi.string(),
    email: Joi.string().email(),
  });

  const formulaireValidationSchema = Joi.object({
    raison_sociale: Joi.string().required(),
    siret: Joi.string().pattern(REGEX.SIRET).required(),
    adresse: Joi.string().required(),
    coordonnees_geo: Joi.string().regex(REGEX.GEO).required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    email: Joi.string().email().required(),
    telephone: Joi.string().regex(REGEX.TELEPHONE).required(),
    mandataire: Joi.boolean().default(false),
    gestionnaire: Joi.string()
      .pattern(REGEX.SIRET)
      .when("mandataire", { is: Joi.equal(true), then: Joi.required() }),
    opco: Joi.object(),
  });

  const offreValidationSchema = Joi.object({
    libelle: Joi.string().required(),
    niveau: Joi.string().required(),
    date_debut_apprentissage: Joi.date().required(),
    romes: Joi.array().items(Joi.string()).required(),
    description: Joi.string(),
    type: Joi.string().valid("Apprentissage", "Professionnalisation").required(),
    multi_diffuser: Joi.boolean().default(null),
  });

  const userValidationSchema = Joi.object({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    email: Joi.string().email().required(),
    telephone: Joi.string().regex(REGEX.TELEPHONE).required(),
    siret: Joi.string().pattern(REGEX.SIRET).required(),
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
    "/formulaire",
    tryCatch(async (req, res) => {
      const { error } = searchValidationSchema.validate(req.query, { abortEarly: false });

      if (error) {
        return res.status(400).json({ status: "INPUT_VALIDATION_ERROR", message: error.message });
      }

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
   *         name: formulaireId
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
   *    summary: Permet de récupérer le formulaire contant l'offre recherché à partir de son identifiant mongoDB
   *    tags:
   *     - Offre
   *    parameters:
   *       - in: _id
   *         name: offreId
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
   * "/:userId":
   *  post:
   *    summary: Permet de créer un nouveau formulaire pour un utilisateur donné
   *    tags:
   *     - Formulaire
   *    parameters:
   *       - in: _id
   *         name: userId
   *         required: true
   *    requestBody:
   *       description: L'objet JSON du formulaire
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *           $ref: "#/components/schemas/formulaire"
   *    responses:
   *      200:
   *        description: un objet contenant le formulaire créé
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/formulaire"
   */
  router.post(
    "/:userId",
    tryCatch(async (req, res) => {
      // update validation info
      const { error } = formulaireValidationSchema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ status: "INPUT_VALIDATION_ERROR", message: error.message, error: true });
      }

      const userExist = await users.getUser({ _id: req.params.userId });

      if (!userExist) {
        return res
          .status(400)
          .json({ status: "NOT_FOUND", error: true, message: "L'utilisateur mentionné n'a pas été trouvé" });
      }

      const siretInfo = await etablissement.getEtablissementFromGouv(req.body.siret);

      if (siretInfo.data?.etablissement.etat_administratif.value === "F") {
        return res
          .status(400)
          .json({ status: "CLOSED", error: true, message: "Cette entreprise est considérée comme fermé." });
      }

      if (siretInfo.data?.etablissement.naf.startsWith("85")) {
        return res.status(400).json({
          status: "UNAUTHORIZED",
          error: true,
          message: "Le numéro siret n'est pas référencé comme une entreprise.",
        });
      }

      let formattedSiretInfo = etablissement.formatEntrepriseData(siretInfo.data.etablissement);

      let opcoResult = await etablissement.getOpco(req.params.siret);
      let geo_coordonnees = await etablissement.getGeoCoordinates(
        `${formattedSiretInfo.adresse}, ${formattedSiretInfo.code_postal}, ${formattedSiretInfo.commune}`
      );

      const response = await formulaire.updateFormulaire({
        gestionnaire: userExist.siret,
        mandataire: true,
        opco: opcoResult.data?.opcoName ?? undefined,
        geo_coordonnees,
        ...req.body,
      });

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
   *    parameters:
   *       - in: id_form
   *         name: formulaireId
   *         required: true
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

      const { error } = offreValidationSchema.validate(req.body, { abortEarly: false });

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
   *  put:
   *    summary: Permet de modifier un formulaire
   *    tags:
   *     - Formulaire
   *    parameters:
   *       - in: id_form
   *         name: formulaireId
   *         required: true
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
  router.put(
    "/:formulaireId",
    tryCatch(async (req, res) => {
      const exist = await formulaire.getFormulaire(req.params.formulaireId);

      if (!exist) {
        return res.status(400).json({ status: "INVALID_RESSOURCE", message: "Formulaire does not exist" });
      }

      const { error } = formulaireValidationSchema.validate(req.body, { abortEarly: false });

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
   *  put:
   *    summary: Permet de modifier une offre pour un formulaire donné
   *    tags:
   *     - Offre
   *    parameters:
   *       - in: _id
   *         name: offreId
   *         required: true
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
  router.put(
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

      const { error } = formulaireValidationSchema.validate(req.body, { abortEarly: false });

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
   *    parameters:
   *       - in: _id
   *         name: offreId
   *         required: true
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
   *    parameters:
   *       - in: _id
   *         name: offreId
   *         required: true
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

  /**
   * @swagger
   * "/offre/:offreId/extend":
   *  put:
   *    summary: Permet de prolonger la visibilité d'une offre d'un mois
   *    tags:
   *     - Offre
   *    parameters:
   *       - in: _id
   *         name: offreId
   *         required: true
   *    responses:
   *      200:
   *        description: le statut 200 (Success)
   */
  router.put(
    "/offre/:offreId/extend",
    tryCatch(async (req, res) => {
      const exist = formulaire.getOffre(req.params.offreId);

      if (!exist) {
        return res.status(400).json({ status: "INVALID_RESSOURCE", message: "Offre does not exist" });
      }

      await formulaire.extendOffre(req.params.offreId);

      return res.sendStatus(200);
    })
  );

  /**
   *
   *
   * GET /api/v1/user/:id
   * POST /api/v1/user/
   * PATCH /api/v1/user/:id
   * DELETE /api/v1/user/:id
   *
   *
   */

  /**
   * @swagger
   * "/user/:userId":
   *  get:
   *    summary: Permet de récupérer les informations d'un utilisateur à partir de son identifiant
   *    tags:
   *     - Utilisateur
   *    parameters:
   *       - in: _id
   *         name: offreId
   *         required: true
   *    responses:
   *      200:
   *        description: un objet contenant le l'utilisateur
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/user"
   */
  router.post(
    "/user/:id",
    tryCatch(async () => {})
  );

  /**
   * @swagger
   * "/user":
   *  post:
   *    summary: Permet de créer un organisme de formation
   *    tags:
   *     - Utilisateur
   *    requestBody:
   *       description: L'objet JSON de l'utilisateur.
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *            type: object
   *            properties:
   *              prenom:
   *                type: string
   *              nom:
   *                type: string
   *              email:
   *                type: string
   *              telephone:
   *                type: string
   *              siret:
   *                type: string
   *            required:
   *              - prenom
   *              - nom
   *              - email
   *              - telephone
   *              - siret
   *    responses:
   *      200:
   *        description: un objet contenant le l'utilisateur
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/user"
   */
  router.post(
    "/user",
    tryCatch(async (req, res) => {
      const { error } = userValidationSchema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ status: "INPUT_VALIDATION_ERROR", message: error.message, error: true });
      }

      const userExist = await users.getUser({ email: req.body.email });

      if (userExist) {
        return res.status(403).json({ status: "USER_ALREADY_EXIST", error: true });
      }

      const { data } = await etablissement.getEtablissementFromCatalogue(req.body.siret);

      const siretInfo = data?.etablissement[0] ?? null;

      if (!siretInfo) {
        return res.status(400).json({
          status: "NOT_FOUND",
          error: true,
          message: "L'organisme de formation n'a pas été trouvé parmis le catalogue des établissements",
        });
      }

      if (siretInfo.ferme === true) {
        return res.status(400).json({
          statut: "ESTABLISHMENT_CLOSED",
          error: true,
          message: "Cette établissement est considérée comme fermé.",
        });
      }

      let formattedSiretInfo = etablissement.formatCatalogueData(siretInfo);

      let newUser = await users.createUser({ type: "CFA", ...formattedSiretInfo, ...req.body });

      return res.json(newUser);
    })
  );

  /**
   * @swagger
   * "/user/:userId":
   *  put:
   *    summary: Permet de mettre à jour les informations d'un utilisateur à partir de son identifiant
   *    tags:
   *     - Utilisateur
   *    parameters:
   *       - in: _id
   *         name: offreId
   *         required: true
   *    responses:
   *      200:
   *        description: un objet contenant le l'utilisateur
   *        content:
   *          application/json:
   *            schema:
   *              $ref: "#/components/schemas/user"
   */
  router.put(
    "/user/:id",
    tryCatch(async () => {})
  );

  /**
   * @swagger
   * "/user/:userId":
   *  delete:
   *    summary: Permet de supprimer un utilisateur à partir de son identifiant
   *    tags:
   *     - Utilisateur
   *    parameters:
   *       - in: _id
   *         name: offreId
   *         required: true
   *    responses:
   *      200:
   *        description: le statut 200 (Success)
   */
  router.delete(
    "/user/:id",
    tryCatch(async () => {})
  );

  return router;
};
