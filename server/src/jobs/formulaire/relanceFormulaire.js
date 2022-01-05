const axios = require("axios");
const config = require("config");
const moment = require("moment");
const logger = require("../../common/logger");
const { Formulaire, User } = require("../../common/model");
const { asyncForEach } = require("../../common/utils/asyncUtils");

const relanceFormulaire = async (mail) => {
  // number of days to expiration for the reminder email to be sent
  let threshold = 7;

  const forms = await Formulaire.find({
    "offres.statut": "Active",
    "offres.relance_mail_sent": false,
    $nor: [{ offres: { $exists: false } }, { offres: { $size: 0 } }],
  }).lean();

  // reduce formulaire with eligible offers
  const format = forms.reduce((acc, formulaire) => {
    acc[formulaire._id] = { ...formulaire, offres: [] };

    formulaire.offres
      // The query returns all offers included in the form, regardless of the status filter in the query.
      // The payload is smaller than not filtering it.
      .filter((x) => x.relance_mail_sent === false && x.statut === "Active")
      .forEach((offre) => {
        let remainingDays = moment(offre.date_expiration).diff(moment(), "days");

        // if the number of days to the expiration date is strictly above the threshold, do nothing
        if (remainingDays > threshold) return;

        offre.supprimer = `${config.publicUrl}/offre/${offre._id}/cancel`;
        offre.pourvue = `${config.publicUrl}/offre/${offre._id}/provided`;

        acc[formulaire._id].offres.push(offre);
      });
    return acc;
  }, {});

  // format array and remove formulaire without offers
  const formulaireToExpire = Object.values(format).filter((x) => x.offres.length !== 0);

  if (formulaireToExpire.length === 0) {
    logger.info("Aucune offre à relancer aujourd'hui.");
    await axios.post(config.slackWebhookUrl, {
      text: `[JOB MATCHA - RELANCE] Aucune relance à effectuer`,
    });
    return;
  }

  const nbOffres = formulaireToExpire.reduce((acc, formulaire) => (acc += formulaire.offres.length), 0);

  await asyncForEach(formulaireToExpire, async (formulaire) => {
    let { email, raison_sociale, _id, nom, prenom, offres, mandataire, origine } = formulaire;
    let contactCFA;

    // get CFA informations if formulaire is handled by a CFA
    if (mandataire) {
      contactCFA = await User.findOne({ scope: origine });
    }

    // Send mail with action links to manage offers
    const mailBody = {
      email: mandataire ? contactCFA.email : email,
      senderName: mandataire ? `${contactCFA.prenom} ${contactCFA.nom}` : raison_sociale,
      templateId: 230,
      params: {
        PRENOM: mandataire ? contactCFA.prenom : prenom,
        NOM: mandataire ? contactCFA.nom : nom,
        RAISON_SOCIALE: raison_sociale,
        OFFRES: offres,
        MANDATAIRE: mandataire,
      },
      subject: "Vos offres vont expirer prochainement",
      tags: ["matcha-relance-expiration"],
    };

    const payload = mail.getEmailBody(mailBody);
    const { body } = await mail.sendmail(payload);

    const result = JSON.parse(body);

    let campagne = "matcha-relance-expiration";
    await mail.logMail(result, campagne, _id);

    await asyncForEach(formulaire.offres, async (offre) => {
      // update record using MongoDB API to avoid timestamp automatic update
      await Formulaire.collection.update({ "offres._id": offre._id }, { $set: { "offres.$.relance_mail_sent": true } });
    });
  });

  if (nbOffres > 0) {
    logger.info(`${nbOffres} offres relancé aujourd'hui.`);
    await axios.post(config.slackWebhookUrl, {
      text: `[JOB MATCHA - RELANCE] *${nbOffres} offres* (${formulaireToExpire.length} formulaires) ont été relancés`,
    });
  }
};

module.exports = { relanceFormulaire };
