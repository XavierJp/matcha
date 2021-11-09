/**
 * Remove unused forms from the 1J1S campaign
 */
const { runScript } = require("../../scriptWrapper");
const { Formulaire } = require("../../../common/model");
const logger = require("../../../common/logger");

runScript(async () => {
  const count = await Formulaire.countDocuments({ offres: { $size: 0 }, origine: "1J1S" });
  await Formulaire.deleteMany({ offres: { $size: 0 }, origine: "1J1S" });
  logger.info(`${count} formulaires vides supprimés`);
});
