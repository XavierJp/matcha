import { Button, Container, Flex, Image } from '@chakra-ui/react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/logo.svg'
import { WidgetContext } from '../../../contextWidget'
import { Close } from '../../../theme/components/icons'

export default (props) => {
  const navigate = useNavigate()
  const { widget } = useContext(WidgetContext)

  if (widget) {
    return props.children
  }

  return (
    <Container maxW='container.xl' p={props.fromDashboard ? '0' : ['0', '5']} pt={props.fromDashboard ? '0' : [2, 5]}>
      <Flex direction='column' mb={['4', '0']}>
        <Flex justifyContent='space-between' alignItems='center' px={['2', '8']} pb={['4', '0']}>
          <Image display='flex' src={logo} alt='logo matcha' mr={5} />
          <Button
            display='flex'
            onClick={props.fromDashboard ? () => props.onClose() : () => navigate('/')}
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
