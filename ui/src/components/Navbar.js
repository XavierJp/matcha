import { Box, Flex, Image, Container, Spacer, Button, Alert, AlertIcon, Center } from '@chakra-ui/react'
import { RiAccountCircleLine } from 'react-icons/ri'

import logo from '../assets/images/logo.svg'
import logoMinistere from '../assets/images/logo-ministere.svg'
import useAuth from '../common/hooks/useAuth'
import { useHistory } from 'react-router'

export default () => {
  const [auth, setAuth] = useAuth()
  const history = useHistory()

  return (
    <>
      {process.env.REACT_APP_BASE_URL.includes('recette') && (
        <Alert status='info' variant='top-accent' justifyContent='center'>
          <AlertIcon />
          Environnement de test
        </Alert>
      )}
      <Box py={3}>
        <Container maxW='container.xl'>
          <Flex justifyContent='flex-start' alignItems='center'>
            <Image src={logoMinistere} alt='logo ministere' />
            <Box pr={10} />
            <Image display={['none', 'flex']} src={logo} alt='logo matcha' />
            <Spacer />
            {auth.sub !== 'anonymous' ? (
              <>
                <Button
                  display={['none', 'flex']}
                  onClick={() => setAuth('')}
                  fontWeight='normal'
                  variant='link'
                  color='bluefrance.500'
                  leftIcon={<RiAccountCircleLine />}
                >
                  Se déconnecter
                </Button>
              </>
            ) : history.location.pathname === '/' ? (
              <>
                <Button
                  display={['none', 'flex']}
                  onClick={() => history.push('/login')}
                  fontWeight='normal'
                  variant='link'
                  color='bluefrance.500'
                  leftIcon={<RiAccountCircleLine />}
                >
                  Espace partenaires
                </Button>
              </>
            ) : null}
          </Flex>
        </Container>
      </Box>
    </>
  )
}
