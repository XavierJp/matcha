import { Switch, Route, Redirect } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { Formulaire, NotFound, Login, List, HomePage, Users } from './pages'
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
          <List />
        </PrivateRoute>
        <PrivateRoute exact path='/admin/users'>
          <Users />
        </PrivateRoute>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/formulaire/:id_form' render={(props) => <Formulaire {...props} byId={true} />} />
        <Route strict path='/:origine/' component={Formulaire} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  )
}

export default App
