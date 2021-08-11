const axios = require("axios");
const config = require("config");
const moment = require("moment");
const logger = require("../../common/logger");
const { Formulaire } = require("../../common/model");
const { asyncForEach } = require("../../common/utils/asyncUtils");

const annuleFormulaire = async () => {
  const today = moment().startOf("day").utc(true);

  const formulaires = await Formulaire.find({
    "offres.statut": "Active",
    "offres.date_expiration": { $lte: today },
    "offres.relance_mail_sent": true,
  }).lean();

  // reduce formulaire with eligible offers
  const offersToCancel = formulaires.reduce((acc, formulaire) => {
    formulaire.offres
      // The query returns all offers included in the form, regardless of the status filter in the query.
      // The payload is smaller than not filtering it.
      .filter((x) => x.relance_mail_sent === true && x.statut === "Active")
      .forEach((offre) => {
        // if the expiration date is not equal or above today's date, do nothing
        if (!moment(offre.date_expiration).isSameOrBefore(today)) return;
        acc.push(offre);
      });
    return acc;
  }, []);

  if (offersToCancel.length === 0) {
    logger.info("Aucune offre à annuler.");
    await axios.post(config.slackWebhookUrl, {
      text: `[JOB MATCHA - EXPIRATION] Aucune offre à annuler`,
    });
    return;
  }

  const stats = {
    offersToCancel: offersToCancel.length,
    totalCanceled: 0,
  };

  await asyncForEach(offersToCancel, async (offre) => {
    await Formulaire.findOneAndUpdate({ "offres._id": offre._id }, { $set: { "offres.$.statut": "Annulée" } });
    stats.totalCanceled += 1;
  });

  if (offersToCancel.length > 0) {
    logger.info(`${stats.totalCanceled} offres expirés`);
    await axios.post(config.slackWebhookUrl, {
      text: `[JOB MATCHA - EXPIRATION] *${stats.offersToCancel}/${stats.totalCanceled} offres* ont expirées et ont été annulées automatiquement`,
    });
  }
};

module.exports = { annuleFormulaire };
