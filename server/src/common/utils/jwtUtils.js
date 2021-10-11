const pick = require("lodash").pick;
const jwt = require("jsonwebtoken");
const config = require("config");

const createToken = (type, subject, options = {}) => {
  const defaults = config.auth[type];
  const secret = options.secret || defaults.jwtSecret;
  const expiresIn = options.expiresIn || defaults.expiresIn;
  const payload = options.payload || {};

  return jwt.sign(payload, secret, {
    issuer: config.appName,
    expiresIn: expiresIn,
    subject: subject,
  });
};

const verifyToken = (token) => {
  const secret = config.auth[type];
  return jwt.verify(token, secret);
};

module.exports = {
  createActivationToken: (subject, options = {}) => createToken("activation", subject, options),
  createPasswordToken: (subject, options = {}) => createToken("password", subject, options),
  createUserToken: (user, options = {}) => {
    const payload = { permissions: pick(user, ["isAdmin"]), organisation: user.organization, scope: user.scope };

    return createToken("user", user.username, { payload, ...options });
  },
  createMagicLinkToken: (subject, options = {}) => createToken("magiclink", subject, options),
  verifyToken,
};
