const { runScript } = require("../../scriptWrapper");
const { Formulaire, User } = require("../../../common/model");
const _ = require("lodash");

runScript(async ({ users, mail }) => {
  let form = await Formulaire.find({ origine: "akto" }).lean();

  let unique = _.uniqBy(form, "email");
  let duplicates = _.difference(form, unique);

  let stat = {
    total: form.length,
    duplicate: duplicates.length,
    uniq: unique.length,
    found: 0,
    missing: 0,
    created: 0,
  };

  await Promise.all(
    unique.map(async (form) => {
      let { email, nom, prenom, raison_sociale } = form;
      let exist = await User.findOne({ email: form.email });

      if (exist) {
        stat.found++;
      } else {
        await users.createUser({
          ...form,
          email_valide: true,
          type: "ENTREPRISE",
        });

        const emailBody = mail.getEmailBody({
          email: email,
          senderName: raison_sociale,
          templateId: 227,
          tags: ["matcha-email-bienvenue"],
          params: {
            RAISON_SOCIALE: raison_sociale,
            NOM: nom,
            PRENOM: prenom,
            EMAIL: email,
          },
        });

        await mail.sendmail(emailBody);

        stat.missing++;
        stat.created++;
      }
    })
  );

  return stat;
});
