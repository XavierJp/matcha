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
import { WidgetFormulaire } from './widget'

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
        ></Route>
        <Route
          path='/admin/users'
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        ></Route>
        <Route path='/' element={<Accueil />} />
        <Route path='/authentification' element={<Connexion />} />
        <Route path='/creation-compte' element={<CreationCompte />} />
        <Route path='/creation-compte/detail' element={<InformationCreationCompte />} />
        <Route path='/authentification/confirmation' element={<ConfirmationCreationCompte />} />
        <Route path='/authentification/validation/:id' element={<ConfirmationValidationEmail />} />
        <Route path='/authentification/verification' element={<ValidationToken />} />
        <Route path='/deleguer-gestion-offre-alternant-of' element={<LandingCfa />} />
        <Route path='/accompagner-entreprise-recherche-alternant' element={<LandingEntreprise />} />
        <Route path='/offre/:idOffre/:option' element={<MailActionsOnOffres />} />
        <Route path='/:origine/' element={<Formulaire />} />
        <Route path='/widget/:origine/' element={<WidgetFormulaire />} />
        <Route>
          <Route
            path='/formulaire/:id_form'
            element={
              <PrivateRoute>
                <Formulaire />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path='*' element={<NonTrouve />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
