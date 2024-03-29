import { Container, Divider, Flex, Spacer, Stack } from '@chakra-ui/react'
import { AnimationContainer, Navbar } from '../../components'
import Etablissement from './components/Etablissement'
import Footer from './components/Footer'
import Mission from './components/Mission'

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
              description='Exprimez vos besoins de recrutement en alternance pour les afficher au plus près des jeunes : La Bonne Alternance, Parcoursup, 1 jeune 1 solution, Affelnet'
              buttonLabel='Diffuser une offre'
              link='/creation/entreprise'
              buttonLabel2='Déléguer la gestion'
              link2='/accompagner-entreprise-recherche-alternant'
              type='ENTREPRISE'
            />
            <Etablissement
              bg='bluefrance.200'
              title='Vous êtes un organisme de formation'
              subtitle='Déposez les offres de vos entreprises partenaires'
              description='Gérez facilement vos mandats de recrutement et la diffusion de vos offres en alternance'
              buttonLabel='Créer votre espace dédié'
              buttonLabel2='Développer mon réseau'
              link='/creation/cfa'
              link2='/deleguer-gestion-offre-alternant-of'
              type='CFA'
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
