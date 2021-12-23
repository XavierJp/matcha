const { Formulaire, User } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");
const { asyncForEach } = require("../../../common/utils/asyncUtils");

runScript(async ({ /*users, */ etablissement }) => {
  const forms = await Formulaire.find({}).select({ events: 0, mailing: 0 }).lean().limit(3);

  // const duplicates = forms
  //   .reduce((acc, form) => {
  //     // console.log(form);
  //     let index = acc.findIndex((i) => i.siret === form.siret);
  //     let hasOffer = form.offres.length > 0 ? true : false;
  //     if (index !== -1) {
  //       acc[index].forms.push({ ...form, hasOffer });
  //     } else {
  //       acc.push({ siret: form.siret, forms: [{ ...form, hasOffer }] });
  //     }
  //     return acc;
  //   }, [])
  //   .filter((x) => x.forms.length > 1);

  // console.log(duplicates);

  // return;

  await asyncForEach(forms, async (form) => {
    const exist = await User.findOne({ email: form.email });
    if (exist) return;

    let format;

    // const { email, raison_sociale, adresse, geo_coordonnees, nom, prenom, telephone, id_form, siret } = form;
    const { siret } = form;

    console.log("Looking for :", siret);

    const result = await etablissement.getEtablissementFromGouv(siret);

    if (result) {
      format = etablissement.formatEntrepriseData(result.data.etablissement);
      format.geo_coordonnees = await etablissement.getGeoCoordinates(
        `${format.adresse}, ${format.code_postal}, ${format.commune}`
      );
      console.log("ETP", format);
      // save
      // await users.createUser({
      //   email,
      //   raison_sociale,
      //   adresse,
      //   geo_coordonnees,
      //   nom,
      //   prenom,
      //   telephone,
      //   id_form,
      //   siret,
      //   type: "ENTREPRISE",
      // });
    } else {
      const [catalogue, referentiel] = await Promise.all([
        etablissement.getEtablissementFromTCO(siret),
        etablissement.getEtablissementFromReferentiel(siret),
      ]);

      // console.log({ referentiel: referentiel?.data, catalogue: catalogue?.data?.etablissements[0] });

      if (catalogue?.data?.ferme === true || referentiel?.data?.etat_administratif === "fermé") {
        return console.log({ siret: siret, error: true, message: "Cette établissement est considérée comme fermé." });
      }

      if (!referentiel && catalogue.data.pagination.total === 0) {
        return console.log({
          siret: siret,
          error: true,
          message: "Le numéro siret n'est pas référencé comme centre de formation.",
        });
      }

      if (!referentiel) {
        format = etablissement.formatTCOData(catalogue.data.etablissements[0]);
      } else {
        format = etablissement.formatReferentielData(referentiel.data);
      }

      console.log("CFA", format);
      // save
      // await users.createUser({
      //   email,
      //   raison_sociale,
      //   adresse,
      //   geo_coordonnees,
      //   nom,
      //   prenom,
      //   telephone,
      //   id_form,
      //   siret,
      //   type: "CFA",
      // });
    }
  });
});
