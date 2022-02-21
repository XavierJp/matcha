const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { createUserToken } = require("../../common/utils/jwtUtils");
const { User } = require("../../common/model");
const { CFA } = require("../../common/constants");

module.exports = ({ etablissement, users, mail, formulaire }) => {
  const router = express.Router();

  /**
   * Récupérer les informations d'une entreprise à l'aide de l'API du gouvernement
   */
  router.get(
    "/entreprise/:siret",
    tryCatch(async (req, res) => {
      if (!req.params.siret) {
        return res.status(400).json({ error: true, message: "Le numéro siret est obligatoire." });
      }

      const result = await etablissement.getEtablissementFromGouv(req.params.siret);

      if (!result) {
        return res.status(400).json({ error: true, message: "Le numéro siret est invalide." });
      }

      if (result.data?.etablissement.etat_administratif.value === "F") {
        return res.status(400).json({ error: true, message: "Cette entreprise est considérée comme fermé." });
      }

      // Check if a CFA already has the company as partenaire
      if (req.query.fromDashboardCfa) {
        const exist = await formulaire.getFormulaire({ siret: req.params.siret, gestionnaire: req.query.gestionnaire });

        if (exist) {
          return res.status(400).json({
            error: true,
            message: "L'entreprise est déjà référencer comme partenaire.",
          });
        }
      }

      // Allow cfa to add themselves as a company
      if (!req.query.fromDashboardCfa) {
        if (result.data?.etablissement.naf.startsWith("85")) {
          return res.status(400).json({
            error: true,
            message: "Le numéro siret n'est pas référencé comme une entreprise.",
          });
        }
      }

      let opcoResult = await etablissement.getOpco(req.params.siret);

      let response = etablissement.formatEntrepriseData(result.data.etablissement);

      console.log(result.data);

      response.geo_coordonnees = await etablissement.getGeoCoordinates(
        `${response.adresse}, ${response.code_postal}, ${response.commune}`
      );

      response.opco = opcoResult.data?.opcoName ?? undefined;

      return res.json(response);
    })
  );

  /**
   * Récupération des informations d'un établissement à l'aide des tables de correspondances et du référentiel
   */
  router.get(
    "/cfa/:siret",
    tryCatch(async (req, res) => {
      if (!req.params.siret) {
        return res.status(400).json({ error: true, message: "Le numéro siret est obligatoire." });
      }

      const exist = await etablissement.getEtablissement({ siret: req.params.siret, type: CFA });

      if (exist) {
        return res
          .status(403)
          .json({ error: true, message: "Ce numéro siret est déjà associé à un compte utilisateur Matcha." });
      }

      const [catalogue, referentiel] = await Promise.all([
        etablissement.getEtablissementFromCatalogue(req.params.siret),
        etablissement.getEtablissementFromReferentiel(req.params.siret),
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
        return res.json({ ...etablissement.formatCatalogueData(catalogue.data.etablissements[0]) });
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
      let exist = await users.getUser({ email: req.body.email });
      let formulaireInfo, partenaire;
      let ENTREPRISE = req.body.type === "ENTREPRISE";

      if (exist) {
        return res.status(403).json({ error: true, message: "L'adresse mail est déjà associé à un compte Matcha." });
      }

      if (ENTREPRISE) {
        formulaireInfo = await formulaire.createFormulaire(req.body);
        partenaire = await users.createUser({ ...req.body, id_form: formulaireInfo.id_form });

        // Dépot simplifié : retourner les informations nécessaire à la suite du parcour
        return res.json({ formulaire: formulaireInfo, user: partenaire });
        /**
         * Comportement précédent ; authentifier l'utilisateur dès la creation
         * return res.json({ token: createMagicLinkToken(email) });
         */
      } else {
        partenaire = await users.createUser(req.body);

        let { email, raison_sociale, _id, nom, prenom } = partenaire;

        const url = etablissement.getValidationUrl(_id);

        const emailBody = mail.getEmailBody({
          email,
          senderName: raison_sociale,
          templateId: 218,
          tags: ["matcha-confirmation-email"],
          params: {
            URL_CONFIRMATION: url,
            NOM: nom,
            PRENOM: prenom,
          },
        });

        await mail.sendmail(emailBody);

        return res.json({ partenaire });
      }
    })
  );

  /**
   * Récupérer les informations d'un partenaire
   */

  router.get(
    "/:siret",
    tryCatch(async (req, res) => {
      const partenaire = await users.getUser({ siret: req.params.siret });
      res.json(partenaire);
    })
  );
  /**
   * Mise à jour d'un partenaire
   */

  router.put(
    "/:id",
    tryCatch(async (req, res) => {
      let result = await users.updateUser(req.params.id, req.body);
      return res.json(result);
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

      const user = await User.findById(req.body.id);

      const emailBody = mail.getEmailBody({
        email: user.email,
        senderName: user.raison_sociale,
        templateId: user.type === "ENTREPRISE" ? 227 : 229,
        tags: ["matcha-email-bienvenue"],
        params: {
          RAISON_SOCIALE: user.raison_sociale,
          NOM: user.nom,
          PRENOM: user.prenom,
          EMAIL: user.email,
        },
      });

      await mail.sendmail(emailBody);

      await users.registerUser(user.email);

      // Log the user in directly
      return res.json({ token: createUserToken(user) });
    })
  );

  return router;
};
