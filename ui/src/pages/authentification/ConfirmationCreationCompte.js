import { Heading, Text, Box, Flex, Link, Divider } from '@chakra-ui/react'
import AuthentificationLayout from './components/Authentification-layout'
import { IoMail } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default (props) => {
  const location = useLocation()
  const [email, setEmail] = useState('')

  useEffect(() => {
    setEmail(location.state.email)
  })

  return (
    <AuthentificationLayout>
      <Box px={['6', '8']} pt={['6w', '12w']}>
        <Heading fontSize={['32px', '40px']} as='h1'>
          Vérifier votre messagerie
        </Heading>
        <Box fontSize={['16px', '22px']}>
          <Text>
            Nous vous avons envoyé un email à <strong>{email}</strong> avec un lien de confirmation. Celui-ci sera
            valide pour les 60 prochaines minutes.
          </Text>
        </Box>

        <Divider my={6} w='20%' />

        <Box>
          <Heading fontSize={['18px', '32px']} as='h2' pb={3}>
            Vous n'avez rien reçu ?
          </Heading>
          <Flex alignItems='center'>
            <IoMail />
            <Link pl={2} href='mailto:matcha@apprentissage.beta.gouv.fr' textDecoration='underline'>
              Contacter l'équipe de Matcha
            </Link>
          </Flex>
        </Box>
      </Box>
    </AuthentificationLayout>
  )
}
