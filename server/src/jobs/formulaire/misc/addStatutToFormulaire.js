const { Formulaire } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");

runScript(async () => {
  await Formulaire.updateMany({}, { statut: "Actif" });
});
