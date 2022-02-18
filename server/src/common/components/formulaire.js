const { Formulaire } = require("../model");
const { POURVUE, ANNULEE } = require("../constants");
const moment = require("moment");

module.exports = () => {
  return {
    getFormulaires: async (query, { page, limit }) => {
      const response = await Formulaire.paginate(query, { page, limit, lean: true });
      return {
        data: response.docs,
        pagination: {
          page: response.page,
          result_per_page: limit,
          number_of_page: response.pages,
          total: response.total,
        },
      };
    },
    getFormulaire: (id_form) => Formulaire.findOne({ id_form }).lean(),
    createFormulaire: (payload) => Formulaire.create(payload),
    updateFormulaire: (id_form, payload) => Formulaire.findOneAndUpdate({ id_form }, payload, { new: true }),
    archiveFormulaire: async (id_form) => {
      let form = await Formulaire.findOne({ id_form });

      form.offres.map((offre) => {
        offre.statut = "Annulée";
      });

      form.statut = "Archivé";
      await form.save();

      return true;
    },
    getOffre: (id) => Formulaire.findOne({ "offres._id": id }),
    createOffre: (id_form, payload) =>
      Formulaire.findOneAndUpdate({ id_form }, { $push: { offres: payload } }, { new: true }),
    updateOffre: (id_offre, payload) =>
      Formulaire.findOneAndUpdate(
        { "offres._id": id_offre },
        {
          $set: {
            "offres.$": payload,
          },
        },
        { new: true }
      ),
    provideOffre: async (id_offre) => {
      await Formulaire.findOneAndUpdate(
        { "offres._id": id_offre },
        {
          $set: {
            "offres.$.statut": POURVUE,
          },
        }
      );
      return true;
    },
    cancelOffre: async (id_offre) => {
      await Formulaire.findOneAndUpdate(
        { "offres._id": id_offre },
        {
          $set: {
            "offres.$.statut": ANNULEE,
          },
        }
      );
      return true;
    },
    extendOffre: async (id_offre) => {
      await Formulaire.findOneAndUpdate(
        { "offres._id": id_offre },
        {
          $set: {
            "offres.$.date_expiration": moment().add(1, "months").format("YYYY-MM-DD"),
            "offres.$.date_derniere_prolongation": Date.now(),
          },
          $inc: { "offres.$.nombre_prolongation": 1 },
        }
      );
      return true;
    },
  };
};
