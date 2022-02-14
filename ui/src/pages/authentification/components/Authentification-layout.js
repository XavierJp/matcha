import { Button, Container, Flex, Image } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/logo.svg'
import { Close } from '../../../theme/components/icons'

export default (props) => {
  const navigate = useNavigate()
  const location = useLocation()

  console.log(location)

  if (location.pathname.includes('widget')) {
    return props.children
  }

  return (
    <Container maxW='container.xl' p={['0', '5']} pt={[2, 5]} h='100vh'>
      <Flex direction='column' h='100vh' mb={['4', '0']}>
        <Flex justifyContent='space-between' alignItems='center' px={['2', '8']} pb={['4', '0']}>
          <Image display='flex' src={logo} alt='logo matcha' mr={5} />
          <Button
            display='flex'
            onClick={() => navigate('/')}
            fontWeight='normal'
            variant='link'
            color='bluefrance.500'
            rightIcon={<Close width={5} />}
          >
            fermer
          </Button>
        </Flex>
        {props.children}
      </Flex>
    </Container>
  )
}
