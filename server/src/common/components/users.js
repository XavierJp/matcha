const { User } = require("../model");
const passwordGenerator = require("generate-password");
const { KEY_GENERATOR_PARAMS } = require("../constants");

module.exports = async () => {
  return {
    createApiKey: () => `mna-${passwordGenerator.generate(KEY_GENERATOR_PARAMS())}`,
    getUser: (email) => User.findOne({ email }),
    createUser: async ({
      nom,
      prenom,
      organization,
      email,
      scope,
      isAdmin = false,
      siret,
      uai,
      raison_sociale,
      telephone,
      adresse,
    }) => {
      if (!scope) {
        // generate user scope
        let key = passwordGenerator.generate(
          KEY_GENERATOR_PARAMS({ length: 5, symbols: false, numbers: true, letters: false })
        );
        scope = `cfa-${key}`;
      }

      let user = new User({
        nom,
        prenom,
        email,
        siret,
        adresse,
        telephone,
        uai,
        raison_sociale,
        organization,
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
    registerUser: (email) => User.findOneAndUpdate({ email }, { last_connection: new Date() }),
  };
};
