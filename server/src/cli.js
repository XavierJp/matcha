const { program: cli } = require("commander");
const { runScript } = require("./jobs/scriptWrapper");
const { createUser } = require("./jobs/formulaire/createUser");
const { getAllEvents } = require("./jobs/formulaire/getAllEvents");
const { createApiUser } = require("./jobs/api/createApiUser");
const { resetApiKey } = require("./jobs/api/resetApiKey");
const { disableApiUser } = require("./jobs/api/disableApiUser");
const { resetPassword } = require("./jobs/formulaire/resetPassword");
const { generateIndexes } = require("./jobs/indexes/generateIndexes");
const { annuleFormulaire } = require("./jobs/formulaire/annuleFormulaire");
const { relanceFormulaire } = require("./jobs/formulaire/relanceFormulaire");

cli.addHelpText("after");

cli
  .command("index")
  .description("Synchronise les index des collections mongo & reconstruit l'index elasticsearch")
  .action(() => {
    runScript(() => generateIndexes());
  });

cli
  .command(
    "create-user <prenom> <nom> <email> <organization> <scope> [uai] [siret] [raison_sociale] [telephone] [adresse]"
  )
  .option("-admin [isAdmin]", "utilisateur administrateur", true)
  .description("Permet de créer un accès utilisateur à l'espace partenaire")
  .action((prenom, nom, email, organization, scope, uai, siret, raison_sociale, telephone, adresse, isAdmin) => {
    runScript(({ users }) =>
      createUser(users, {
        prenom,
        nom,
        uai,
        siret,
        raison_sociale,
        telephone,
        adresse,
        email,
        organization,
        scope,
        isAdmin: isAdmin?.Admin,
      })
    );
  });

cli
  .command("create-api-user <nom> <prenom> <email> <organization> <scope>")
  .description("Permet de créer un utilisateur ayant accès à l'API")
  .action((nom, prenom, email, organization, scope) => {
    runScript(() => createApiUser(nom, prenom, email, organization, scope));
  });

cli
  .command("reset-api-user <email>")
  .description("Permet de réinitialiser la clé API d'un utilisateur")
  .action((email) => {
    runScript(({ users }) => resetApiKey(users, email));
  });

cli
  .command("disable-api-user <email> [state]")
  .description("Permet de d'activer/désactiver l'accès d'un utilisateur à l'API")
  .action((email, state) => {
    runScript(() => disableApiUser(email, state));
  });

cli
  .command("reset-password <email>")
  .description("Réinitialisation du mot de passe de l'utilisateur <email>")
  .action((email) => {
    runScript(() => resetPassword(email));
  });

cli
  .command("relance-formulaire")
  .description("Envoie une relance par mail pour les offres expirant dans 7 jours")
  .action(() => {
    runScript(({ mail }) => relanceFormulaire(mail));
  });

cli
  .command("annulation-formulaire")
  .description("Annule les offres pour lesquels la date d'expiration est correspondante à la date actuelle")
  .action(() => {
    runScript(() => annuleFormulaire());
  });

cli
  .command("recuperer-evenements")
  .description("Récupérer l'ensemble des emails envoyés pour un formulaire donné")
  .action(() => {
    runScript(({ mail }) => getAllEvents(mail));
  });

cli.parse(process.argv);
