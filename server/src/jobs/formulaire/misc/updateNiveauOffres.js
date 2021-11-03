const { Formulaire } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");

const getLevel = (level) => {
  switch (level) {
    case "CAP, BEP":
      return "Cap, autres formations niveau (Infrabac)";

    case "Baccalauréat":
      return "BP, Bac, autres formations niveau (Bac)";
    case "DEUG, BTS, DUT, DEUST":
      return "BTS, DEUST, autres formations niveau (Bac+2)";
    case "Licence, Licence professionnelle":
      return "Licence, autres formations niveau (Bac+3)";
    case "Maitrise, master 1":
      return "Master, titre ingénieur, autres formations niveau (Bac+5)";
    case "Master 2, DEA, DESS, Ingénieur":
      return "Master, titre ingénieur, autres formations niveau (Bac+5)";
    case "Doctorat, recherche":
      return "Master, titre ingénieur, autres formations niveau (Bac+5)";
    default:
      break;
  }
};

runScript(async () => {
  // update record using MongoDB API to avoid timestamp automatic update
  await Formulaire.collection.find({ offres: { $exists: true } }).forEach(async (formulaire) => {
    formulaire.offres.forEach((offre) => {
      offre.niveau = getLevel(offre.niveau);
    });
    // update record using MongoDB API to avoid timestamp automatic update
    await Formulaire.collection.update({ _id: formulaire._id }, formulaire);
  });
});
