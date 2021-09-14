const { Formulaire } = require("../model");

module.exports = () => {
  return {
    getFormulaire: async (query, { page, limit }) => {
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
    createFormulaire: async (payload) => {
      const form = await Formulaire.create(payload);
      return form;
    },
    updateFormulaire: async (id_form, payload) => {
      const form = await Formulaire.updateOne({ id_form }, payload, { new: true });
      return form;
    },
    deleteFormulaire: async (id_form) => await Formulaire.deleteOne({ id_form }),
    getOffre: async (id) => {
      const form = Formulaire.findOne({ "offres._id": id });
      return form;
    },
    createOffre: async (id_form, payload) => {
      const form = await Formulaire.findOneAndUpdate({ id_form }, { $push: { offres: payload } }, { new: true });
      return form;
    },
    updateOffre: async (id_offre, payload) => {
      const form = await Formulaire.findOneAndUpdate(
        { "offres._id": id_offre },
        {
          $set: {
            "offres.$": payload,
          },
        },
        { new: true }
      );
      return form;
    },
    provideOffre: async (id_offre) => {
      const form = await Formulaire.findOneAndUpdate(
        { "offres._id": id_offre },
        {
          $set: {
            "offres.$.statut": "Pourvue",
          },
        },
        { new: true }
      );
      return form;
    },
    cancelOffre: async (id_offre) => {
      const form = await Formulaire.findOneAndUpdate(
        { "offres._id": id_offre },
        {
          $set: {
            "offres.$.statut": "Annulée",
          },
        },
        { new: true }
      );
      return form;
    },
  };
};
