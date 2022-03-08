import { Button, Center, Container, Divider, Flex, SimpleGrid, Spacer, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { AnimationContainer, Navbar } from '../../components'
import { Logo404 } from '../../theme/components/logos'
import Footer from '../accueil/components/Footer'
import Mission from '../accueil/components/Mission'

export default () => {
  let navigate = useNavigate()
  return (
    <AnimationContainer>
      <Navbar />
      <Flex direction='column' height='100vh'>
        <Container maxW='container.xl' my={[5, 10]} h='100%'>
          <SimpleGrid columns={[1, 2]} spacing={[5, 0]} h='100%'>
            <Flex direction='column' align='center' justify='center'>
              <Text fontSize='76px' pb='32px'>
                404
              </Text>
              <Text pb='24px'>Vous êtes perdus ?</Text>
              <Text pb='24px' align='center'>
                Il semble que la page que vous essayez de rejoindre n’existe pas. En cas de problème pour retrouver la
                page, essayez de repartir de la page d’accueil en cliquant sur le lien ci-dessous.
              </Text>
              <Button variant='primary' onClick={() => navigate('/')}>
                Page d'accueil
              </Button>
            </Flex>
            <Center>
              <Logo404 maxW='100%' />
            </Center>
          </SimpleGrid>
        </Container>
        <Spacer />
        <Mission />
        <Divider />
        <Footer />
      </Flex>
    </AnimationContainer>
  )
}
