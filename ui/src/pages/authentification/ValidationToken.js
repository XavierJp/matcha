import { useEffect } from 'react'
import { useBoolean, Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { useHistory, useLocation } from 'react-router-dom'
import { validateToken } from '../../api'
import useAuth from '../../common/hooks/useAuth'

export default () => {
  let history = useHistory()
  const location = useLocation()
  const [auth, setAuth] = useAuth()

  const { search } = location
  const fromEntrepriseCreation = location.state

  let params = new URLSearchParams(search)
  let token = params.get('token')

  useEffect(() => {
    if (!token) {
      history.push('/')
    }

    // send token to back office
    validateToken({ token })
      .then(({ data }) => {
        setAuth(data?.token)
      })
      .catch(() => {
        history.push('/')
      })
  }, [token])

  useEffect(() => {
    if (auth.sub !== 'anonymous') {
      if (auth.type === 'ENTREPRISE' && auth.id_form) {
        setTimeout(() => {
          history.push(`/formulaire/${auth.id_form}`, { offerPopup: fromEntrepriseCreation ? true : false })
        }, 3500)
      } else {
        setTimeout(() => {
          history.push('/admin')
        }, 3500)
      }
    }
  }, [auth])

  return (
    <>
      <Box>
        <Flex justify='center' align='center' h='100vh' direction='column'>
          <Spinner thickness='4px' speed='0.5s' emptyColor='gray.200' color='bluefrance.500' size='xl' />
          <Text>Connexion en cours...</Text>
        </Flex>
      </Box>
    </>
  )
}
