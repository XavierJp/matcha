import { Heading, Text, Box, useBoolean, Link } from '@chakra-ui/react'
import { useEffect } from 'react'

import AuthentificationLayout from './components/Authentification-layout'
import { validationCompte } from '../../api'
import { useHistory, useParams } from 'react-router-dom'
import useAuth from '../../common/hooks/useAuth'

/**
 *
 * Validate email & redirect to admin
 */

const EmailInvalide = () => (
  <>
    <Box pt={['6w', '12w']}>
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
  const [isValid, setIsValid] = useBoolean()
  const { id } = useParams()
  const history = useHistory()
  const [, setAuth] = useAuth()

  useEffect(() => {
    // get user from params coming from email link
    validationCompte({ id })
      .then(({ data }) => {
        setAuth(data?.token)
        setIsValid.on()
        history.push('/admin', { newUser: true })
      })
      .catch(() => setIsValid.off())
  }, [id])

  return <AuthentificationLayout>{!isValid && <EmailInvalide />}</AuthentificationLayout>
}
