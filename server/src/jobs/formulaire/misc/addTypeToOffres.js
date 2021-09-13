const { Formulaire } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");

runScript(async () => {
  // update record using MongoDB API to avoid timestamp automatic update
  await Formulaire.collection.find({ offres: { $exists: true } }).forEach(async (formulaire) => {
    formulaire.offres.forEach((offre) => {
      offre.type = "Apprentissage";
    });
    // update record using MongoDB API to avoid timestamp automatic update
    await Formulaire.collection.update({ _id: formulaire._id }, formulaire);
  });
});
