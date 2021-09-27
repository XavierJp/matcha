import { useHistory } from 'react-router'
import { IoIosArrowForward } from 'react-icons/io'
import { Container, Flex, Box, Heading, Text, Button, Image } from '@chakra-ui/react'

import illustrationHero from '../../../assets/images/Illustration-hero.svg'

export default () => {
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
