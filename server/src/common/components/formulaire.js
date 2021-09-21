const { Formulaire } = require("../model");

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
    getFormulaire: async (id_form) => Formulaire.findOne({ id_form }),
    createFormulaire: async (payload) => Formulaire.create(payload),
    updateFormulaire: async (id_form, payload) => Formulaire.updateOne({ id_form }, payload, { new: true }),
    deleteFormulaire: async (id_form) => Formulaire.deleteOne({ id_form }),
    getOffre: async (id) => Formulaire.findOne({ "offres._id": id }),
    createOffre: async (id_form, payload) =>
      Formulaire.findOneAndUpdate({ id_form }, { $push: { offres: payload } }, { new: true }),
    updateOffre: async (id_offre, payload) =>
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
            "offres.$.statut": "Pourvue",
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
            "offres.$.statut": "Annulée",
          },
        }
      );
      return true;
    },
  };
};
