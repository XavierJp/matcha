import { Flex, Divider, Spacer } from '@chakra-ui/react'
import { Navbar, AnimationContainer } from '../../components'
import Mission from './components/Mission'
import Footer from './components/Footer'
import Hero from './components/Hero'

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
