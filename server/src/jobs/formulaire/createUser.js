const logger = require("../../common/logger");
const passwordGenerator = require("generate-password");

const passwordOptions = {
  length: 12,
  numbers: true,
};

const createUser = async (users, email, username, organization, scope, isAdmin = false) => {
  let password = passwordGenerator.generate(passwordOptions);

  let exist = await users.getUser(email);
  if (exist) {
    logger.error(`Users ${email} already exist - ${exist._id}`);
    return;
  }

  let payload = {
    email,
    password,
    username,
    organization,
    scope,
    isAdmin,
  };

  await users.createUser(payload);

  logger.info(`User created : ${email} — ${scope} - ${username}-${password}`);
};

module.exports = { createUser };
