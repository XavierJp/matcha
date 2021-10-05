import {
  Box,
  Flex,
  Image,
  Container,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Icon,
  Text,
  MenuItem,
  MenuDivider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { RiAccountCircleLine } from 'react-icons/ri'

import logo from '../assets/images/logo.svg'
import logoMinistere from '../assets/images/logo-ministere.svg'
import LogoAkto from '../assets/images/akto'
import useAuth from '../common/hooks/useAuth'
import { useHistory } from 'react-router'
import { useContext } from 'react'
import { LogoContext } from '../contextLogo'

export default () => {
  const { organisation } = useContext(LogoContext)
  const [auth, setAuth] = useAuth()
  const history = useHistory()

  return (
    <Box pb={3}>
      {process.env.REACT_APP_BASE_URL.includes('recette') && (
        <Alert status='info' variant='top-accent' justifyContent='center'>
          <AlertIcon />
          Environnement de test
        </Alert>
      )}
      <Container maxW='container.xl'>
        <Flex justifyContent='flex-start' alignItems='center'>
          <Image src={logoMinistere} alt='logo ministere' mr={5} />
          <Image display={['none', 'flex']} src={logo} alt='logo matcha' mr={5} />
          {organisation?.includes('akto') && <LogoAkto display={['none', 'flex']} w='100px' h={6} />}
          <Spacer />
          {history.location.pathname === '/' && auth.sub === 'anonymous' && (
            <Button
              display={['none', 'flex']}
              onClick={() => history.push('/authentification')}
              fontWeight='normal'
              variant='link'
              color='bluefrance.500'
              leftIcon={<RiAccountCircleLine />}
            >
              Espace partenaires
            </Button>
          )}
          {auth.sub !== 'anonymous' && (
            <Menu>
              <MenuButton as={Button} variant='pill'>
                <Flex alignItems='center'>
                  <Icon as={RiAccountCircleLine} color='bluefrance.500' />
                  <Box display={['none', 'block']} ml={2}>
                    <Text color='bluefrance.500'>{auth.sub}</Text>
                  </Box>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => history.push('/admin')}>Gestion des offres</MenuItem>
                {auth.permissions.isAdmin && (
                  <>
                    <MenuDivider />
                    <MenuItem onClick={() => history.push('/admin/users')}>Gestion des utilisateurs</MenuItem>
                  </>
                )}
                <MenuDivider />
                <MenuItem onClick={() => setAuth('')}>Déconnexion</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Container>
    </Box>
  )
}
