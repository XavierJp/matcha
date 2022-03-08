const express = require("express");
const axios = require("axios");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const querystring = require("querystring");
const moment = require("moment");
const config = require("config");

const isTokenValid = (token) => token.expire?.isAfter(moment());

const getToken = async (token = {}) => {
  let isValid = isTokenValid(token);

  if (isValid) {
    return token;
  }

  try {
    const response = await axios.post(
      "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=partenaire",
      querystring.stringify({
        grant_type: "client_credentials",
        client_id: config.pe.client_id,
        client_secret: config.pe.client_secret,
        scope: `api_romev1 application_${config.pe.client_id} nomenclatureRome`,
      }),
      {
        headers: {
          Authorization: `Bearer ${config.pe.client_secret}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return {
      ...response.data,
      expire: moment().add(response.data.expires_in - 10, "s"),
    };
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

module.exports = () => {
  const router = express.Router();

  let token = {};

  router.get(
    "/detail/:rome",
    tryCatch(async (req, res) => {
      token = await getToken(token);

      console.log(req.query);

      let response = await axios.get(`https://api.emploi-store.fr/partenaire/rome/v1/metier/${req.params.rome}`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });

      return res.json(response.data);
    })
  );

  return router;
};
