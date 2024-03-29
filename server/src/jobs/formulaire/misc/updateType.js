const { Formulaire } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");

const getType = (type) => {
  switch (type) {
    case "Apprentissage":
      return ["Apprentissage"];

    case "Professionnalisation":
      return ["Professionnalisation"];

    default:
      return ["Apprentissage"];
  }
};

runScript(async () => {
  // update record using MongoDB API to avoid timestamp automatic update
  await Formulaire.collection.find({ offres: { $exists: true } }).forEach(async (formulaire) => {
    formulaire.offres.forEach((offre) => {
      offre.type = getType(offre.type);
    });
    // update record using MongoDB API to avoid timestamp automatic update
    await Formulaire.collection.update({ _id: formulaire._id }, formulaire);
  });
});
