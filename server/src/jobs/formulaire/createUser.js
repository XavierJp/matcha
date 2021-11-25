const logger = require("../../common/logger");

const createUser = async (
  users,
  { prenom, nom, uai, siret, raison_sociale, telephone, adresse, email, organization, scope, isAdmin }
) => {
  let exist = await users.getUser(email);
  if (exist) {
    logger.error(`Users ${email} already exist - ${exist._id}`);
    return;
  }

  let payload = {
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
    isAdmin,
  };

  await users.createUser(payload);

  logger.info(`User created : ${email} — ${scope} - admin: ${isAdmin}`);
};

module.exports = { createUser };
