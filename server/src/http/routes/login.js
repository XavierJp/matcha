const express = require("express");
const Joi = require("joi");
const config = require("config");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { createUserToken, createMagicLinkToken } = require("../../common/utils/jwtUtils");

const checkToken = (users) => {
  passport.use(
    "jwt",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromBodyField("token"),
        secretOrKey: config.auth.magiclink.jwtSecret,
      },
      (jwt_payload, done) => {
        return users
          .getUser(jwt_payload.sub)
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "User not found" });
            }
            return done(null, user);
          })
          .catch((err) => done(err));
      }
    )
  );

  return passport.authenticate("jwt", { session: false, failWithError: true });
};

module.exports = ({ users, mail, etablissement }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.post(
    "/magiclink",
    tryCatch(async (req, res) => {
      const { email } = await Joi.object({
        email: Joi.string().email().required(),
      }).validateAsync(req.body, { abortEarly: false });

      const user = await users.getUser(email);

      if (!user) {
        return res.status(400).json({ error: true, message: "L’adresse email renseignée n’existe pas" });
      }

      if (user.email_valide === false) {
        let { email, raison_sociale, _id, prenom, nom } = user;

        const url = etablissement.getValidationUrl(_id);

        const emailBody = mail.getEmailBody({
          email,
          senderName: raison_sociale ?? `${prenom} ${nom}`,
          templateId: 218,
          tags: ["matcha-confirmation-email"],
          params: {
            URL_CONFIRMATION: url,
          },
        });

        await mail.sendmail(emailBody);

        return res.status(400).json({
          error: true,
          message:
            "Votre adresse n’a pas été vérifiée. Cliquez sur le lien que nous venons de vous transmettre pour vérifier votre compte",
        });
      }

      const magiclink = `${config.publicUrl}/authentification/verification?token=${createMagicLinkToken(email)}`;

      const mailBody = mail.getEmailBody({
        email: user.email,
        senderName: `${user.prenom} ${user.nom}`,
        templateId: 217,
        tags: ["matcha-magiclink"],
        subject: "Lien de connexion à votre espace partenaire",
        params: { MAGICLINK: magiclink, NOM: user.nom, PRENOM: user.prenom },
      });

      await mail.sendmail(mailBody);

      return res.sendStatus(200);
    })
  );

  router.post(
    "/verification",
    checkToken(users),
    tryCatch(async (req, res) => {
      const user = req.user;
      await users.registerUser(user.email);
      return res.json({ token: createUserToken(user) });
    })
  );

  return router;
};
