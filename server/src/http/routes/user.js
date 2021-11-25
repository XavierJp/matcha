const express = require("express");
const { User } = require("../../common/model");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ users }) => {
  const router = express.Router();

  router.get(
    "/",
    tryCatch(async (req, res) => {
      const users = await User.find({}).select("-password");
      return res.json(users);
    })
  );

  router.post(
    "/",
    tryCatch(async (req, res) => {
      const user = await users.createUser(req.body);
      return res.json(user);
    })
  );

  router.put(
    "/:userId",
    tryCatch(async (req, res) => {
      const userPayload = req.body;
      const { userId } = req.params;
      const user = await users.updateUser(userId, userPayload);
      return res.json(user);
    })
  );

  router.delete(
    "/:userId",
    tryCatch(async (req, res) => {
      const { userId } = req.params;
      await users.removeUser(userId);
      return res.sendStatus(200);
    })
  );

  return router;
};
