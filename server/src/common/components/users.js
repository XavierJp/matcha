const { User } = require("../model");
const passwordGenerator = require("generate-password");
const { KEY_GENERATOR_PARAMS } = require("../constants");

module.exports = async () => {
  return {
    createApiKey: () => `mna-${passwordGenerator.generate(KEY_GENERATOR_PARAMS())}`,
    getUser: (query) => User.findOne(query),
    createUser: async (values) => {
      let scope = values.scope ?? undefined;

      if (!scope && values.type === "CFA") {
        // generate user scope
        let key = passwordGenerator.generate(
          KEY_GENERATOR_PARAMS({ length: 5, symbols: false, numbers: true, letters: false })
        );
        scope = `cfa-${key}`;
      } else {
        scope = `etp-${values.raison_sociale.toLowerCase().replace(/ /g, "-")}`;
      }

      let isAdmin = values.isAdmin ?? false;

      let user = new User({
        ...values,
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
