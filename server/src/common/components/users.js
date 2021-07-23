const { User } = require("../model");
const sha512Utils = require("../utils/sha512Utils");
const passwordGenerator = require("generate-password");

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
    createUser: async ({ nom, prenom, username, organization, password, email, scope, isAdmin = false }) => {
      if (!scope) {
        throw new Error("scope is mandatory");
      }

      let hash;
      if (!password) {
        const password = passwordGenerator.generate(passwordOptions);
        hash = sha512Utils.hash(password);
      }

      let user = new User({
        nom,
        prenom,
        username,
        email,
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
