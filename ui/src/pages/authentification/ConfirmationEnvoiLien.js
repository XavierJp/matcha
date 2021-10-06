import { Heading, Text, Box, Flex, Link, Divider } from '@chakra-ui/react'
import AuthentificationLayout from './components/Authentification-layout'
import { IoMail } from 'react-icons/io5'

export default (props) => {
  return (
    <AuthentificationLayout>
      <Box pt={['6w', '12w']}>
        <Heading fontSize='40px' as='h1'>
          Vérfier votre messagerie
        </Heading>
        <Box fontSize='xl'>
          <Text>
            Nous vous avons envoyé un email à <strong> `{props.email}`</strong> avec un lien de confirmation.
          </Text>
          <Text>Celui-ci sera valide pour les 30 prochaines minutes.</Text>
        </Box>
      </Box>

      <Divider my={6} w='20%' />

      <Box>
        <Heading fontSize='32px' as='h2' pb={3}>
          Vous n'avez rien reçu ?
        </Heading>
        <Flex alignItems='center'>
          <IoMail />
          <Link pl={2} href='mailto:matcha@apprentissage.beta.gouv.fr' textDecoration='underline'>
            Contacter l'équipe de Matcha
          </Link>
        </Flex>
      </Box>
    </AuthentificationLayout>
  )
}
