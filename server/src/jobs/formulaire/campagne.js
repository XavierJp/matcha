/* eslint-disable */
const { paginator } = require("../../common/utils/paginator");
const { Formulaire } = require("../../common/model");
const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");
const config = require("config");

const launch = async (mail) => {
  await paginator(
    Formulaire,
    { origine: "1J1S" },
    // { $nor: [{ offres: { $exists: false } }, { offres: { $size: 0 } }] },
    { lean: true, maxItems: 42000, limit: 30 }, // premier envoi 1J1S
    // { lean: true, maxItems: 1, limit: 1 }, // Test 1 formulaire
    // { lean: true, offset: 42000 }, // second envoi 1J1S
    async (form) => {
      const campagne = "matcha-1J1S";
      // const campagne = "test";

      const { raison_sociale, email, id_form, _id } = form;
      const params = {
        URL: `${config.publicUrl}/formulaire/${id_form}`,
      };

      const body = {
        sender: {
          name: "Ministère du Travail",
          email: "matcha@apprentissage.beta.gouv.fr",
        },
        to: [
          {
            name: `${raison_sociale}`,
            email: `${email}`,
          },
        ],
        replyTo: {
          name: "Equipe Matcha",
          email: "matcha@apprentissage.beta.gouv.fr",
        },
        // subject: `Recrutez un alternant en 3 clics`,
        templateId: 194,
        tags: [campagne],
        params: params,
      };

      const { body: res } = await mail.sendmail(body);

      const result = JSON.parse(res);

      await mail.logMail(result, campagne, _id);
    }
  );
};

runScript(async ({ mail }) => {
  await launch(mail);
});
