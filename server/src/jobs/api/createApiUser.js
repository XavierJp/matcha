const { Credential } = require("../../common/model");
const logger = require("../../common/logger");

const createApiUser = async (nom, prenom, email, organisation, scope) => {
  const apiUser = await Credential.create({ nom, prenom, email, organisation, scope });
  logger.info(`API-KEY : ${apiUser.apiKey}`);
};

module.exports = { createApiUser };
