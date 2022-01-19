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
 * La bonne Alternance API (domaine/métier)
 */
export const getMetier = (search) =>
  Axios.get(`https://labonnealternance.apprentissage.beta.gouv.fr/api/romelabels?title=${search}`)
/**
 * Formulaire API
 */
export const getFormulaires = (query) => API.get('/formulaire', query).catch(errorHandler)
export const getFormulaire = (formId) => API.get(`/formulaire/${formId}`).catch(errorHandler)
export const postFormulaire = (form) => API.post(`/formulaire`, form).catch(errorHandler)
export const putFormulaire = (formId, form) => API.put(`/formulaire/${formId}`, form).catch(errorHandler)

/**
 * Offre API
 */
export const postOffre = (formId, offre) => API.post(`/formulaire/${formId}/offre`, offre).catch(errorHandler)
export const putOffre = (offreId, offre) =>
  API.put(`/formulaire/offre/${offreId}`, { ...offre, date_mise_a_jour: Date() }).catch(errorHandler)
export const cancelOffre = (offreId) => API.put(`/formulaire/offre/${offreId}/cancel`)
export const fillOffre = (offreId) => API.put(`/formulaire/offre/${offreId}/provided`)

/**
 * User API
 */
export const getUsers = async () => await API.get('/user').catch(errorHandler)
export const createUser = async (user) => await API.post('/user', user).catch(errorHandler)
export const updateUser = async (userId, user) => await API.put(`user/${userId}`, user).catch(errorHandler)
export const deleteUser = async (userId) => await API.delete(`/user/${userId}`).catch(errorHandler)

/**
 * Auth API
 */
export const validateToken = async (token) => await API.post(`/login/verification`, token)
export const sendMagiclink = async (email) => await API.post(`/login/magiclink`, email)

export const getCfaInformation = async (siret) => await API.get(`/etablissement/cfa/${siret}`)
export const getEntrepriseInformation = async (siret) => await API.get(`/etablissement/entreprise/${siret}`)
export const createPartenaire = (partenaire) => API.post('/etablissement/creation', partenaire)
export const validationCompte = (id) => API.post('/etablissement/validation', id)

/**
 * Landing page API
 */
export const postCfaLanding = (values) => API.post('/landing/cfa', values)
export const postEntrepriseLanding = (values) => API.post('/landing/entreprise', values)

export const getWithQS = (payload) =>
  API.get('/formulaire', { params: { query: JSON.stringify(payload.query), ...payload } })
