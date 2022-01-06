import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Center, VStack, Image, Text, Button } from '@chakra-ui/react'
import logo from '../../assets/images/logo.svg'

export default () => {
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(() => {
      navigate('/')
    }, 3000)
  })

  return (
    <Center h='100vh'>
      <VStack>
        <Image src={logo} pb={5} />
        <Text pb={5}>Page inconnue</Text>
        <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </VStack>
    </Center>
  )
}
