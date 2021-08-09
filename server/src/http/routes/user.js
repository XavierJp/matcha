const config = require("config");
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
      const password = users.generatePassword();
      const user = await users.createUser({ ...userPayload, password });

      let { email, username, nom, prenom, _id } = user;

      let mailParams = {
        email,
        senderName: `${prenom} ${nom}`,
        templateId: 208,
        tags: ["matcha-nouveau-utilisateur"],
        params: {
          URL: `${config.publicUrl}/admin`,
          USERNAME: username,
          PASSWORD: password,
        },
      };

      console.log(mailParams);

      // // send mail with credentials
      const mailBody = mail.getEmailBody(mailParams);

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
