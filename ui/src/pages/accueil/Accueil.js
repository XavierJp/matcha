import { Flex, Divider, Spacer, Stack, Container } from '@chakra-ui/react'
import { Navbar, AnimationContainer } from '../../components'
import Mission from './components/Mission'
import Footer from './components/Footer'
import Etablissement from './components/Etablissement'

export default () => {
  return (
    <AnimationContainer>
      <Navbar />
      <Flex direction='column' height='100vh'>
        <Container maxW='container.xl' my={[5, 10]}>
          <Stack direction={['column', 'row']} spacing='27px' align='stretch' mx={[5, 10]}>
            <Etablissement
              bg='bluefrance.100'
              title='Vous êtes une entreprise'
              subtitle='Simplifiez la diffusion de vos offres en alternance'
              description='Exprimer vos besoins de recrutement en alternance pour les afficher au plus près des jeunes : La Bonne Alternance, Parcoursup, 1 jeune 1 solution, AFFELNET'
              buttonLabel='Poster une offre'
              link='/matcha/'
            />
            <Etablissement
              bg='bluefrance.200'
              title='Vous êtes un CFA'
              subtitle='Déposez les offres de vos entreprises partenaires'
              description='Gérer facilement vos mandats de recrutement et la diffusion de vos offres en alternance'
              buttonLabel='Accéder à votre espace'
              link='/authentification'
            />
          </Stack>
        </Container>

        <Spacer />
        <Mission />
        <Divider />
        <Footer />
      </Flex>
    </AnimationContainer>
  )
}
