const { Formulaire, User } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");
const { asyncForEach } = require("../../../common/utils/asyncUtils");

runScript(async ({ users, etablissement }) => {
  const forms = await Formulaire.find({ origine: { $not: /cfa-*/ } })
    .select({ events: 0, mailing: 0 })
    .lean();

  let count = {
    total: forms.length,
    exist: 0,
    closedETP: 0,
    closedCFA: 0,
    inserted: 0,
    escaped: 0,
  };

  await asyncForEach(forms, async (form) => {
    const exist = await User.findOne({ email: form.email });
    if (exist) {
      count.exist++;
      return;
    }

    let format;

    const { email, nom, prenom, telephone, id_form, siret } = form;

    console.log("Looking for:", siret);

    const result = await etablissement.getEtablissementFromGouv(siret);

    if (result.data?.etablissement.etat_administratif.value === "F") {
      count.closedETP++;
      return;
    }

    if (result.data?.etablissement.naf.startsWith("85")) {
      // search CFA
      const [catalogue, referentiel] = await Promise.all([
        etablissement.getEtablissementFromTCO(siret),
        etablissement.getEtablissementFromReferentiel(siret),
      ]);

      if (catalogue?.data?.ferme === true || referentiel?.data?.etat_administratif === "fermé") {
        count.closedCFA++;
        return;
      }

      if (!referentiel && catalogue.data.pagination.total === 0) {
        count.escaped++;
        return;
      }

      if (!referentiel) {
        format = etablissement.formatTCOData(catalogue.data.etablissements[0]);
      } else {
        format = etablissement.formatReferentielData(referentiel.data);
      }

      console.log("CFA", format);
      // save
      const user = await users.createUser({
        email,
        raison_sociale: format.raison_sociale,
        adresse: `${format.adresse}, ${format.code_postal}, ${format.commune}`,
        geo_coordonnees: format.geo_coordonnees,
        uai: format.uai,
        nom,
        prenom,
        telephone,
        siret,
        type: "CFA",
      });

      await Formulaire.updateMany({ siret, email }, { origine: user.scope });

      count.inserted++;

      return;
    }

    if (result) {
      format = etablissement.formatEntrepriseData(result.data.etablissement);
      format.geo_coordonnees = await etablissement.getGeoCoordinates(
        `${format.adresse}, ${format.code_postal}, ${format.commune}`
      );

      // save
      await users.createUser({
        email,
        raison_sociale: format.raison_sociale,
        adresse: `${format.adresse}, ${format.code_postal}, ${format.commune}`,
        geo_coordonnees: format.geo_coordonnees,
        nom,
        prenom,
        telephone,
        id_form,
        siret,
        type: "ENTREPRISE",
      });

      count.inserted++;
    } else {
      const [catalogue, referentiel] = await Promise.all([
        etablissement.getEtablissementFromTCO(siret),
        etablissement.getEtablissementFromReferentiel(siret),
      ]);

      if (catalogue?.data?.ferme === true || referentiel?.data?.etat_administratif === "fermé") {
        count.closedCFA++;
        return;
      }

      if (!referentiel && catalogue.data.pagination.total === 0) {
        count.escaped++;
        return;
      }

      if (!referentiel) {
        format = etablissement.formatTCOData(catalogue.data.etablissements[0]);
      } else {
        format = etablissement.formatReferentielData(referentiel.data);
      }

      console.log("CFA", format);
      // save
      await users.createUser({
        email,
        raison_sociale: format.raison_sociale,
        adresse: `${format.adresse}, ${format.code_postal}, ${format.commune}`,
        geo_coordonnees: format.geo_coordonnees,
        nom,
        prenom,
        telephone,
        id_form,
        siret,
        type: "CFA",
      });
      count.inserted++;
    }
  });

  return count;
});
