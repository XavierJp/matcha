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
} from '@chakra-ui/react'
import { RiAccountCircleLine } from 'react-icons/ri'

import logo from '../assets/images/logo.svg'
import logoMinistere from '../assets/images/logo-ministere.svg'
import useAuth from '../common/hooks/useAuth'
import { useHistory } from 'react-router'

export default () => {
  const [auth, setAuth] = useAuth()
  const history = useHistory()

  return (
    <Box py={3}>
      <Container maxW='container.xl'>
        <Flex justifyContent='flex-start' alignItems='center'>
          <Image src={logoMinistere} alt='logo ministere' />
          <Box pr={10} />
          <Image display={['none', 'flex']} src={logo} alt='logo matcha' />
          <Spacer />
          {history.location.pathname === '/' && auth.sub === 'anonymous' && (
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
