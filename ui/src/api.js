import Axios from 'axios'

const API = Axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})

const errorHandler = (error) => {
  if (error.response && error.response.data) {
    console.log("Erreur de l'API :", error)
  }
}

/**
 * Formulaire API
 */
export const getFormulaire = (formId) => API.get(`/formulaire/${formId}`).catch(errorHandler)
export const postFormulaire = (form) => API.post(`/formulaire`, form).catch(errorHandler)
export const putFormulaire = (formId, form) => API.put(`/formulaire/${formId}`, form).catch(errorHandler)

/**
 * Offre API
 */
export const postOffre = (formId, offre) => API.post(`/formulaire/${formId}/offre`, offre).catch(errorHandler)
export const putOffre = (offreId, offre) => API.put(`/formulaire/offre/${offreId}`, offre).catch(errorHandler)

/**
 * User API
 */
export const getUsers = async () => await API.get('/user').catch(errorHandler)
export const createUser = async (user) => await API.post('/user', user).catch(errorHandler)
export const updateUser = async (userId, user) => await API.put(`user/${userId}`, user).catch(errorHandler)
export const deleteUser = async (userId) => await API.delete(`/user/${userId}`).catch(errorHandler)

export const getSiretInfo = async (siret) => await API.get(`/entreprise/${siret}`).catch(errorHandler)
export const getWithQS = (payload) =>
  API.get('/formulaire', { params: { query: JSON.stringify(payload.query), ...payload } })
