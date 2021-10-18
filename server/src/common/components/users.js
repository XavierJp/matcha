const { User } = require("../model");
const sha512Utils = require("../utils/sha512Utils");
const passwordGenerator = require("generate-password");
const { KEY_GENERATOR_PARAMS } = require("../constants");

const passwordOptions = {
  length: 12,
  numbers: true,
};

const rehashPassword = (user, password) => {
  user.password = sha512Utils.hash(password);
  return user.save();
};

module.exports = async () => {
  return {
    generatePassword: () => passwordGenerator.generate(passwordOptions),
    createApiKey: () => `mna-${passwordGenerator.generate(KEY_GENERATOR_PARAMS())}`,
    authenticate: async (username, password) => {
      const user = await User.findOne({ username });
      if (!user) {
        return null;
      }

      const current = user.password;
      if (sha512Utils.compare(password, current)) {
        if (sha512Utils.isTooWeak(current)) {
          await rehashPassword(user, password);
        }
        return user.toObject();
      }
      return null;
    },
    getUser: (email) => User.findOne({ email }),
    createUser: async ({
      nom,
      prenom,
      username,
      organization,
      password,
      email,
      scope,
      isAdmin = false,
      siret,
      uai,
      raison_sociale,
      telephone,
      adresse,
      geo_coordonnees,
      userType = "basic",
    }) => {
      if (userType === "basic" && !scope) {
        throw new Error("scope is mandatory");
      }

      let key = passwordGenerator.generate(
        KEY_GENERATOR_PARAMS({ length: 5, symbols: false, numbers: true, letters: false })
      );
      // generate user scope
      scope = `cfa-${key}`;

      let hash;
      if (!password) {
        const password = passwordGenerator.generate(passwordOptions);
        hash = sha512Utils.hash(password);
      } else {
        hash = sha512Utils.hash(password);
      }

      let user = new User({
        nom,
        prenom,
        username,
        email,
        siret,
        adresse,
        telephone,
        uai,
        raison_sociale,
        geo_coordonnees,
        organization,
        password: hash,
        isAdmin: isAdmin,
        scope: scope,
      });

      await user.save();
      user.password = undefined;
      return user.toObject();
    },
    updateUser: async (userId, userPayload) => {
      const user = await User.findOneAndUpdate({ _id: userId }, userPayload, { new: true });
      return user;
    },
    removeUser: async (id) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error(`Unable to find user ${id}`);
      }

      return await user.deleteOne({ _id: id });
    },
    changePassword: async (username, newPassword) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error(`Unable to find user ${username}`);
      }

      user.password = sha512Utils.hash(newPassword);
      await user.save();

      return user.toObject();
    },
    registerUser: (email) => User.findOneAndUpdate({ email }, { last_connection: new Date() }),
  };
};
