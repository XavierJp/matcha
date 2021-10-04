const { Formulaire } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");

runScript(async () => {
  let count = 0;
  // update record using MongoDB API to avoid timestamp automatic update
  await Formulaire.collection.find({ offres: { $exists: true } }).forEach(async (formulaire) => {
    formulaire.offres.forEach((offre) => {
      if (!offre.type || offre.type === "") {
        count++;
        offre.type = "Apprentissage";
      }
    });
    // update record using MongoDB API to avoid timestamp automatic update
    await Formulaire.collection.update({ _id: formulaire._id }, formulaire);
  });
  return { count };
});
