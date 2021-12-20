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

module.exports = {
  createActivationToken: (subject, options = {}) => createToken("activation", subject, options),
  createPasswordToken: (subject, options = {}) => createToken("password", subject, options),
  createUserToken: (user, options = {}) => {
    const payload = {
      permissions: pick(user, ["isAdmin"]),
      organisation: user.organization,
      scope: user.scope,
      nom: user.nom,
      prenom: user.prenom,
      type: user.type,
      id_form: user.id_form,
    };

    return createToken("user", user.email, { payload, ...options });
  },
  createMagicLinkToken: (subject, options = {}) => createToken("magiclink", subject, options),
};
