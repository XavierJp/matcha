import { Box, Container, Divider, Spacer, Flex } from '@chakra-ui/react'
import Mission from '../pages/accueil/components/Mission'
import Footer from '../pages/accueil/components/Footer'
import Navbar from './Navbar'

export default ({ children, background, widget }) => {
  return (
    <Container maxW='full' p='0'>
      <Flex direction='column' h='100vh'>
        {widget === true ? '' : <Navbar />}
        <Box bg={background ?? 'lightGrey'} flexGrow='1'>
          {children}
        </Box>
        {widget === true ? (
          ''
        ) : (
          <>
            <Spacer />
            <Box>
              <Mission />
              <Divider />
              <Footer />
            </Box>
          </>
        )}
      </Flex>
    </Container>
  )
}
