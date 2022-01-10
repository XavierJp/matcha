const { Formulaire, User } = require("../../../common/model");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const { runScript } = require("../../scriptWrapper");

runScript(async () => {
  const data = await Formulaire.find({ origine: /cfa-/, gestionnaire: { $exists: false } });

  let stat = { total: data.length, error: 0, linked: 0 };

  await asyncForEach(data, async (form) => {
    let { origine } = form;
    const cfa = await User.findOne({ scope: origine });

    if (!cfa) {
      stat.error++;
    }

    form.gestionnaire = cfa.siret;

    await form.save();
    stat.linked++;
  });

  return stat;
});
