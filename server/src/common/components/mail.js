const got = require("got");
const config = require("config");
const mailRules = require("./mail.rules");
const { Transactional, Formulaire } = require("../model");

module.exports = () => {
  return {
    sendmail: async (body) => {
      if (!body.sender) {
        throw new Error("Sendmail ERROR : sender is missing");
      }

      if (!body.to) {
        throw new Error("Sendmail ERROR : recipient is missing");
      }

      if (!body.templateId) {
        throw new Error("Sendmail ERROR : templateId is missing");
      }

      const options = {
        method: "POST",
        url: "https://api.sendinblue.com/v3/smtp/email",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": config.sendinblue.apikey,
        },
        json: body,
        retry: 10,
      };

      try {
        const result = await got(options);
        return result;
      } catch (error) {
        throw new Error("Sendmail ERROR :", error);
      }
    },
    getEmailBody: ({ email, senderName, templateId, params, tags, subject }) => {
      if (!email) {
        throw new Error("getEmailBody ERROR : email is missing");
      }
      if (!senderName) {
        throw new Error("getEmailBody ERROR : senderName is missing");
      }
      if (!templateId) {
        throw new Error("getEmailBody ERROR : templateId is missing");
      }
      if (isNaN(templateId) || typeof templateId !== "number") {
        throw new Error("getEmailBody ERROR : templateId must be a Number");
      }
      if (!tags) {
        throw new Error("getEmailBody ERROR : tags is missing");
      }
      if (!Array.isArray(tags)) {
        throw new Error("getEmailBody ERROR : tags must be an array of string(s)");
      }

      return {
        sender: {
          name: "Mission interministérielle pour l'apprentissage",
          email: "matcha@apprentissage.beta.gouv.fr",
        },
        to: [
          {
            name: senderName.split("").length > 70 ? `${senderName.substring(0, 70)}` : `${senderName}`,
            email: `${email}`,
          },
        ],
        replyTo: {
          name: "Equipe Matcha",
          email: "matcha@apprentissage.beta.gouv.fr",
        },
        subject,
        templateId,
        tags,
        params: {
          ...params,
        },
      };
    },
    requestMailTransaction: async (options) => {
      try {
        await Transactional.create(options);
        return true;
      } catch (error) {
        throw new Error("RequestMail ERROR", error);
      }
    },
    getAllEvents: async (messageId) => {
      const body = {
        method: "GET",
        url: `https://api.sendinblue.com/v3/smtp/statistics/events?limit=100&messageId=${messageId}&sort=desc`,
        headers: { Accept: "application/json", "api-key": config.sendinblue.apikey },
      };

      try {
        const result = await got(body);
        const { events } = await JSON.parse(result.body);
        return events;
      } catch (error) {
        throw new Error("getAllEventsByEmail ERROR", error);
      }
    },
    createContact: async ({ email, attributes, listIds }) => {
      if (!email || !attributes || !listIds) {
        throw new Error("missing arguments");
      }

      if (!Array.isArray(listIds) && !listIds.some(isNaN)) {
        throw new Error("listIds must be an array of number");
      }

      const payload = {
        method: "POST",
        url: "https://api.sendinblue.com/v3/contacts",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": config.sendinblue.apikey,
        },
        json: JSON.stringify({
          attributes: { ...attributes },
          listIds,
          email,
          updateEnabled: true,
          emailBlacklisted: false,
          smsBlacklisted: false,
        }),
        retry: 10,
      };

      const res = await got(payload);
      return res;
    },
    updateContact: async ({ email, attributes, listIds }) => {
      if (!email || !attributes || !listIds) {
        throw new Error("missing arguments");
      }

      if (!Array.isArray(listIds) && !listIds.some(isNaN)) {
        throw new Error("listIds must be an array of number");
      }

      const options = {
        method: "PUT",
        url: `https://api.sendinblue.com/v3/contacts/${email.replace("@", "%40")}`,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": config.sendinblue.apikey,
        },
        json: JSON.stringify({
          attributes: { ...attributes },
          listIds,
          updateEnabled: true,
          emailBlacklisted: false,
          smsBlacklisted: false,
        }),
        retry: 10,
      };

      try {
        const res = await got(options);
        if (res.statusCode === 204) {
          console.log(`contact ${email} updated — attemps: ${res.attempts}`);
        } else {
          console.log(res.body);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    getRulesFromEvent: (event) => mailRules.find((rule) => rule.event === event),
    logMail: ({ code, message, messageId }, campagne, _id) =>
      Formulaire.findByIdAndUpdate(_id, { $push: { mailing: { campagne, code, message, messageId } } }),
  };
};
