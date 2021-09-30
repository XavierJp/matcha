import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Center, VStack, Image, Text, Button } from '@chakra-ui/react'
import logo from '../../assets/images/logo.svg'

export default () => {
  const history = useHistory()
  useEffect(() => {
    setTimeout(() => {
      history.push('/')
    }, 3000)
  })

  return (
    <Center h='100vh'>
      <VStack>
        <Image src={logo} pb={5} />
        <Text pb={5}>Page inconnue</Text>
        <Button onClick={() => history.push('/')}>Retour à l'accueil</Button>
      </VStack>
    </Center>
  )
}
