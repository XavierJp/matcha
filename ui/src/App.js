import { Switch, Route, Redirect } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import {
  Formulaire,
  NonTrouve,
  Accueil,
  Users,
  Search,
  Connexion,
  ConfirmationCreationCompte,
  ValidationToken,
  ConfirmationValidationEmail,
  CreationCompte,
  InformationCreationCompte,
  LandingCfa,
  LandingEntreprise,
} from './pages'

import { Formulaire as Widget } from './widget'

import useAuth from './common/hooks/useAuth'

function PrivateRoute({ children, ...rest }) {
  let [auth] = useAuth()

  return (
    <Route
      {...rest}
      render={() => {
        return auth.sub !== 'anonymous' ? children : <Redirect to='/' />
      }}
    />
  )
}

const App = () => {
  return (
    <AnimatePresence>
      <Switch>
        <PrivateRoute exact path='/admin'>
          <Search />
        </PrivateRoute>
        <PrivateRoute exact path='/admin/users'>
          <Users />
        </PrivateRoute>
        <Route exact path='/' component={Accueil} />
        <Route exact path='/authentification' component={Connexion} />
        <Route exact path='/creation-compte' component={CreationCompte} />
        <Route exact path='/creation-compte/detail' component={InformationCreationCompte} />
        <Route exact path='/authentification/confirmation' component={ConfirmationCreationCompte} />
        <Route exact path='/authentification/validation/:id' component={ConfirmationValidationEmail} />
        <Route exact path='/authentification/verification' component={ValidationToken} />
        <Route exact path='/deleguer-gestion-offre-alternant-of' component={LandingCfa} />
        <Route exact path='/accompagner-entreprise-recherche-alternant' component={LandingEntreprise} />
        <Route exact path='/:origine/' component={Formulaire} />
        <Route exact path='/widget/:origine/' render={(props) => <Widget {...props} widget={true} />} />
        <PrivateRoute>
          <Route
            exact
            path='/formulaire/:id_form'
            render={(props) => <Formulaire {...props} byId={true} widget={false} />}
          />
        </PrivateRoute>
        <Route component={NonTrouve} />
      </Switch>
    </AnimatePresence>
  )
}

export default App
