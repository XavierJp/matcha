const { Formulaire } = require("../../../common/model");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const { runScript } = require("../../scriptWrapper");

const axios = require("axios");

runScript(async () => {
  const data = await Formulaire.find({ createdAt: { $gte: "2021-12-21" } });

  let stat = { total: data.length, error: 0, linked: 0 };

  await asyncForEach(data, async (form) => {
    let { geo_coordonnees, adresse, siret } = form;

    let [lat, lon] = geo_coordonnees.split(",");

    const result = await axios.get(`https://api-adresse.data.gouv.fr/reverse/?lat=${lat}&lon=${lon}`);

    console.log("Search for:", lat, lon, siret, "—", adresse, "=", result.data.features[0].properties.label);

    form.adresse = result.data.features[0].properties.label;

    await form.save();
  });

  return stat;
});
