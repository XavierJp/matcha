const { Formulaire } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");

runScript(async () => {
  // update record using MongoDB API to avoid timestamp automatic update
  await Formulaire.collection.updateMany({}, { $set: { statut: "Actif" } });
});
