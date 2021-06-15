const { Formulaire } = require("../../common/model");
const { asyncForEach } = require("../../common/utils/asyncUtils");
const { paginator } = require("../../common/utils/paginator");
const moment = require("moment");
const { runScript } = require("../scriptWrapper");
const mail = require("../../common/components/mail");
const logger = require("../../common/logger");

const transactionalReports = async () => {
  // number of days to expiration for the reminder email to be sent
  let threshold = 7;

  await paginator(
    Formulaire,
    { "offres.statut": "Active", $nor: [{ offres: { $exists: false } }, { offres: { $size: 0 } }] },
    {},
    async (formulaire) => {
      let { email, raison_sociale, id_form, _id } = formulaire;

      const params = [];

      await asyncForEach(formulaire.offres, async (offre) => {
        let { date_expiration } = offre;

        if (offre.statut != "Active") return;

        let remainingDays = moment(date_expiration).diff(moment(), "day");
        // if the current date is not equal or above the trigger date, do nothing

        if (remainingDays !== threshold) return;

        // add offers details to params array
        params.push(offre);
      });

      // Send mail with action links to manage offers
      const mailBody = {
        email,
        raison_sociale,
        id_form,
        templateId: 182,
        tags: ["bot-relance-expiration"],
        params,
      };

      const payload = mail.getEmailBody(mailBody);

      const { body: result } = await mail.sendmail(payload);

      const message = {
        campagne: "bot-relance-expiration",
        code: result.code ?? null,
        message: result.message ?? null,
        messageId: result.messageId ?? null,
      };

      if (!result.messageId) {
        logger.info(`error : ${message.code} —— ${message.message} — ${email}`);
      }

      await Formulaire.findByIdAndUpdate(_id, { $push: { mailing: message } });
    }
  );
};

runScript(async () => await transactionalReports());

module.exports = { transactionalReports };