/**
 * Remove unused forms from the LBB campaign
 */

const { runScript } = require("../../scriptWrapper");
const { Formulaire } = require("../../../common/model");
const logger = require("../../../common/logger");

runScript(async () => {
  const count = await Formulaire.countDocuments({ origine: "1J1S" });
  await Formulaire.deleteMany({ origine: "1J1S" });
  logger.info(`${count} formulaires vides supprimés`);
});
