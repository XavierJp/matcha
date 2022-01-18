const pick = require("lodash").pick;
const jwt = require("jsonwebtoken");
const config = require("config");

const { CFA } = require("../constants");

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
      siret: user.siret,
      id_form: user.id_form,
      mandataire: user.type === CFA ? true : false,
      gestionnaire: user.type === CFA ? user.siret : undefined,
    };

    return createToken("user", user.email, { payload, ...options });
  },
  createMagicLinkToken: (subject, options = {}) => createToken("magiclink", subject, options),
};
