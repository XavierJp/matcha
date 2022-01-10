import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { validateToken } from '../../api'
import useAuth from '../../common/hooks/useAuth'

export default () => {
  let navigate = useNavigate()
  const location = useLocation()
  const [auth, setAuth] = useAuth()

  const { search } = location
  const fromEntrepriseCreation = location.state

  let params = new URLSearchParams(search)
  let token = params.get('token')

  useEffect(() => {
    if (!token) {
      navigate('/')
    }

    // send token to back office
    validateToken({ token })
      .then(({ data }) => {
        setAuth(data?.token)
      })
      .catch(() => {
        navigate('/')
      })
  }, [token])

  useEffect(() => {
    if (auth.sub !== 'anonymous') {
      if (auth.type === 'ENTREPRISE' && auth.id_form) {
        setTimeout(() => {
          navigate(`/formulaire/${auth.id_form}`, { state: { offerPopup: fromEntrepriseCreation ? true : false } })
        }, 3500)
      } else {
        setTimeout(() => {
          navigate('/admin')
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
