const createMail = require("./mail");
const createUsers = require("./users");
const createStats = require("./statistique");
const { connectToMongo } = require("../mongodb");
const createFormulaire = require("./formulaire");
const createEtablissement = require("./etablissement");
const createApplication = require("./application");

module.exports = async (options = {}) => {
  const mail = options.mail || (await createMail());
  const users = options.users || (await createUsers());
  const stats = options.stats || (await createStats());
  const formulaire = options.formulaire || (await createFormulaire());
  const etablissement = options.etablissement || createEtablissement();
  const application = options.application || createApplication();

  return {
    mail,
    stats,
    users,
    formulaire,
    etablissement,
    application,
    db: options.db || (await connectToMongo()).db,
  };
};
