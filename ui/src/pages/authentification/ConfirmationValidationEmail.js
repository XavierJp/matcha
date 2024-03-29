import { Heading, Text, Box, useBoolean, Link, Spinner, Flex } from '@chakra-ui/react'
import { useEffect } from 'react'

import AuthentificationLayout from './components/Authentification-layout'
import { validationCompte } from '../../api'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../common/hooks/useAuth'

/**
 *
 * Validate email & redirect to admin
 */

const EmailInvalide = () => (
  <>
    <Box pt={['6w', '12w']} px={['6', '8']}>
      <Heading fontSize={['32px', '40px']} as='h1'>
        Mail invalide
      </Heading>
      <Text fontSize={['16px', '22px']}>
        La validation de votre email à échoué. Merci de{' '}
        <Link pl={2} href='mailto:matcha@apprentissage.beta.gouv.fr' textDecoration='underline'>
          Contacter l'équipe de Matcha
        </Link>
      </Text>
    </Box>
  </>
)

export default (props) => {
  const [isValid, setIsValid] = useBoolean(true)
  const { id } = useParams()
  const navigate = useNavigate()
  const [auth, setAuth] = useAuth()

  useEffect(() => {
    // get user from params coming from email link
    validationCompte({ id })
      .then(({ data }) => {
        setAuth(data?.token)
      })
      .catch(() => setIsValid.off())
  }, [id])

  useEffect(() => {
    if (auth.sub !== 'anonymous') {
      if (auth.id_form) {
        setTimeout(() => {
          navigate(`/formulaire/${auth.id_form}`, { state: { newUser: true } })
        }, 3500)
      } else {
        setTimeout(() => {
          navigate('/admin', { state: { newUser: true } })
        }, 3500)
      }
    }
  }, [auth])

  return (
    <>
      {isValid && (
        <Box>
          <Flex justify='center' align='center' h='100vh' direction='column'>
            <Spinner thickness='4px' speed='0.5s' emptyColor='gray.200' color='bluefrance.500' size='xl' />
            <Text>Verification en cours...</Text>
          </Flex>
        </Box>
      )}
      {!isValid && (
        <AuthentificationLayout>
          <EmailInvalide />
        </AuthentificationLayout>
      )}
    </>
  )
}
