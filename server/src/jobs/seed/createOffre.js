const { Formulaire, Offre } = require("../../common/model");
const logger = require("../../common/logger");

const createOffreCollection = async () => {
  logger.info("Deleting offres collections...");
  await Offre.deleteMany({});

  logger.info("Creating offres collections...");
  let formulaires = await Formulaire.find({}).lean();

  await Promise.all(
    formulaires.map(async (form) => {
      await Promise.all(
        form.offres.map(async (offre) => {
          offre._id = undefined;
          await Offre.create(offre);
        })
      );
    })
  );

  let offres = await Offre.countDocuments();

  return { offres };
};

module.exports = { createOffreCollection };
