const { Credential } = require("../../common/model");
const logger = require("../../common/logger");

const resetApiKey = async (users, email) => {
  const apiKey = await users.createApiKey();
  const updatedUser = await Credential.findOneAndUpdate({ email }, { apiKey }, { new: true });

  logger.info(`API-KEY : ${updatedUser.apiKey}`);
};

module.exports = { resetApiKey };
