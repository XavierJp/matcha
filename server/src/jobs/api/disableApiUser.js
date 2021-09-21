const { Credential } = require("../../common/model");
const logger = require("../../common/logger");

const disableApiUser = async (email, state = false) => {
  const updatedUser = await Credential.findOneAndUpdate({ email }, { actif: state }, { new: true });

  logger.info(`User ${updatedUser.email} disabled — API state : ${updatedUser.actif}`);
};

module.exports = { disableApiUser };
