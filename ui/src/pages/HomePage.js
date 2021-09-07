import {
  Box,
  Text,
  Image,
  Container,
  Grid,
  GridItem,
  Heading,
  Button,
  Flex,
  Link,
  Divider,
  Icon,
  Stack,
  Spacer,
} from '@chakra-ui/react'
import { Navbar, AnimationContainer } from '../components'

import { IoIosArrowForward } from 'react-icons/io'
import { FiExternalLink } from 'react-icons/fi'

import logoMinistere from '../assets/images/logo-ministere.svg'
import illustrationHero from '../assets/images/Illustration-hero.svg'
import { useHistory } from 'react-router'

export default () => {
  return (
    <AnimationContainer>
      <Navbar />
      <Flex direction='column' height='100vh'>
        <Hero />
        <Spacer />
        <Mission />
        <Divider />
        <Footer />
      </Flex>
    </AnimationContainer>
  )
}

const Hero = () => {
  const history = useHistory()

  return (
    <Container maxW='container.xl'>
      <Flex m={[5, 10]} justifyContent='space-between'>
        <Box>
          <Heading>Exprimez votre </Heading>
          <Heading pb={5}>besoin en alternance</Heading>
          <Text pb={10} maxW={['100%', '80%']}>
            Matcha vous permet en quelques secondes d'exprimer vos besoins de recrutement en alternance pour les
            afficher sur le site <strong>La Bonne Alternance</strong>
          </Text>
          <Button variant='primary' rightIcon={<IoIosArrowForward />} px={6} onClick={() => history.push('/matcha/')}>
            Je poste mon offre
          </Button>
        </Box>
        <Image src={illustrationHero} display={['none', 'flex']} />
      </Flex>
    </Container>
  )
}

export const Mission = () => (
  <Container maxW='container.xl'>
    <Grid templateColumns={['1fr', '5fr 7fr']} gap={5} alignItems='center' pb={4}>
      <GridItem>
        <Image src={logoMinistere} w={['60%', '40%']} />
      </GridItem>
      <GridItem>
        <Text pb={4}>
          De nombreux jeunes cherchent actuellement un contrat d'apprentissage. Ils et elles sont motivées et
          disponibles tout de suite, et peuvent correspondre à vos besoins immédiats de recrutement.
        </Text>
        <Text pb={4}>
          L'apprentissage, c'est la garantie de transmettre votre savoir-faire et d'embaucher une future recrue tout en
          bénéficiant du soutien de l'État.
        </Text>
        <Stack direction={['column', 'row']} spacing={[5, 10]}>
          <Link href='https://mission-apprentissage.gitbook.io/general/' isExternal>
            <Text fontWeight='bold'>Mission Apprentissage</Text>
          </Link>
          <Link href='https://beta.gouv.fr/' isExternal>
            <Text fontWeight='bold'>Beta.gouv.fr</Text>
          </Link>
          <Link href='https://www.service-public.fr/' isExternal>
            <Text fontWeight='bold'>service-public.fr</Text>
          </Link>
        </Stack>
      </GridItem>
    </Grid>
  </Container>
)

export const Footer = () => (
  <Container maxW='container.xl' py={[5, 10]}>
    <Stack direction={['column', 'row']}>
      <Link color='emphase' href='https://beta.gouv.fr/accessibilite/' isExternal>
        Accessibilité
      </Link>
      <Divider height={['0px', '20px']} orientation='vertical' />
      <Link color='emphase' href='https://beta.gouv.fr/apropos/' isExternal>
        Mention Légales
      </Link>
      <Divider height={['0px', '20px']} orientation='vertical' />
      <Link color='emphase' href='https://beta.gouv.fr/suivi/' isExternal>
        Données personnelles
      </Link>
    </Stack>

    <Text pt={8} color='emphase'>
      Sauf mention contraire, tous les textes de ce site sont sous{' '}
      <Link href='https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf' isExternal>
        <Text as='u'>
          licence Etatlab-2.0 <Icon as={FiExternalLink} mx={1} />
        </Text>
      </Link>
    </Text>
  </Container>
)
