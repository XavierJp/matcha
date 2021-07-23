const express = require("express");
const logger = require("../../common/logger");
const { User } = require("../../common/model");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ users, mail }) => {
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
      const userPayload = req.body;
      let user = await users.createUser(userPayload);

      let { email, username, password, nom, prenom, _id } = user;
      // send mail with credentials
      const mailBody = users.getEmailBody({ email, username, password, nom, prenom });

      const { body: result } = await mail.sendmail(mailBody);

      if (!result.messageId) {
        logger.info(`error : ${result} — ${email}`);
      }

      await User.findByIdAndUpdate(_id, { mail_sent: true });

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
