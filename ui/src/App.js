import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import useAuth from './common/hooks/useAuth'
import {
  Accueil,
  ConfirmationCreationCompte,
  ConfirmationValidationEmail,
  Connexion,
  CreationCompte,
  Formulaire,
  InformationCreationCompte,
  LandingCfa,
  LandingEntreprise,
  MailActionsOnOffres,
  NonTrouve,
  Search,
  Users,
  ValidationToken,
} from './pages'
import DepotRapide_AjouterVoeux from './pages/formulaire/components/DepotRapide_AjouterVoeux'
import DepotRapide_Fin from './pages/formulaire/components/DepotRapide_Fin'

function PrivateRoute({ children }) {
  let [auth] = useAuth()

  return auth.sub !== 'anonymous' ? children : <Navigate to='/authentification' />
}

const App = () => {
  return (
    <AnimatePresence>
      <Routes>
        <Route
          path='/admin'
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route path='/' element={<Accueil />} />
        <Route path='/authentification' element={<Connexion />} />
        <Route path='/creation/entreprise' element={<CreationCompte type='ENTREPRISE' />} />
        <Route path='/creation/entreprise/:origine' element={<CreationCompte type='ENTREPRISE' />} />
        <Route path='/creation/cfa' element={<CreationCompte type='CFA' />} />
        <Route path='/creation/detail' element={<InformationCreationCompte />} />
        <Route path='/creation/offre' element={<DepotRapide_AjouterVoeux />} />
        <Route path='/creation/fin' element={<DepotRapide_Fin />} />
        <Route path='/authentification/confirmation' element={<ConfirmationCreationCompte />} />
        <Route path='/authentification/validation/:id' element={<ConfirmationValidationEmail />} />
        <Route path='/authentification/verification' element={<ValidationToken />} />
        <Route path='/deleguer-gestion-offre-alternant-of' element={<LandingCfa />} />
        <Route path='/accompagner-entreprise-recherche-alternant' element={<LandingEntreprise />} />
        <Route path='/offre/:idOffre/:option' element={<MailActionsOnOffres />} />
        <Route
          path='/:origine/'
          element={
            <PrivateRoute>
              <Formulaire />
            </PrivateRoute>
          }
        />
        <Route path='/widget/:origine/' element={<CreationCompte type='ENTREPRISE' />} />
        <Route
          path='/formulaire/:id_form'
          element={
            <PrivateRoute>
              <Formulaire />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<NonTrouve />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
