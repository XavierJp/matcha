const path = require("path");
const csv = require("csvtojson");
const logger = require("../../../common/logger");
const { runScript } = require("../../scriptWrapper");
const { Formulaire } = require("../../../common/model");
const cliProgress = require("cli-progress");
const { oleoduc, writeData } = require("oleoduc");
const { Readable } = require("stream");

const progress = new cliProgress.SingleBar({}, cliProgress.Presets.rect);

const importer = async () => {
  const file = path.resolve(__dirname, "../assets/lbb-1j1s.csv");
  const data = await (await csv().fromFile(file)).filter((x) => x.score > 50 && x.email !== "null");

  progress.start(data.length, 0);

  await oleoduc(
    Readable.from(data),
    writeData(
      async (e) => {
        let { siret, raisonsociale, email } = e;

        const payload = {
          siret,
          email,
          raison_sociale: raisonsociale,
          origine: "1J1S",
        };

        await Formulaire.create(payload);
        progress.increment();
      },
      { parallel: 500 }
    )
  );

  progress.stop();
};

runScript(async () => {
  logger.info("START import LBB");

  await importer();
});
