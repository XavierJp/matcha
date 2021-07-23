import { Link } from 'react-router-dom'
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Container,
  Box,
  Center,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spacer,
  Flex,
  useToast,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { AiOutlineEdit } from 'react-icons/ai'
import { IoIosAddCircleOutline } from 'react-icons/io'

import { Layout } from '../../components'
import { ArrowDropRightLine } from '../../theme/components/icons/'
import { useEffect, useState } from 'react'
import { createUser, getUsers, updateUser } from '../../api'
import AjouterUtilisateur from './AjouterUtilisateur'

const MyTable = ({ users, editUser }) => {
  if (users.length < 0) return <div>Chargement en cours</div>

  return (
    <Box py='4'>
      <Table size='sm' bg='white'>
        <Thead borderBottom='2px solid grey'>
          <Th>Admin</Th>
          <Th py={6} paddingLeft='30px'>
            Username
          </Th>
          <Th>Email</Th>
          <Th>Organisation</Th>
          <Th>Scope des offres visibles (Origine)</Th>
          <Th>Edition</Th>
        </Thead>
        <Tbody>
          {users?.map((item, index) => {
            return (
              <Tr key={index}>
                <Td>{item.isAdmin ? 'Oui' : 'Non'}</Td>
                <Td py={4} paddingLeft='30px'>
                  {item.username}
                </Td>
                <Td>{item.email}</Td>
                <Td>{item.organization}</Td>
                <Td>{item.scope}</Td>
                <Td>
                  <Center>
                    <Link onClick={() => editUser(item)}>
                      <Icon color='bluefrance.500' w={5} h={5} as={AiOutlineEdit} />
                    </Link>
                  </Center>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}

export default () => {
  const [users, setUsers] = useState([])
  const ajouterUserPopup = useDisclosure()
  const [currentUser, setCurrentUser] = useState({})
  const toast = useToast()

  useEffect(() => {
    getUsers().then((users) => setUsers(users.data))
  })

  const editUser = (user) => {
    setCurrentUser(user)
    ajouterUserPopup.onOpen()
  }

  const addUser = () => {
    setCurrentUser({})
    ajouterUserPopup.onOpen()
  }

  const saveUser = (values) => {
    if (currentUser._id) {
      // update
      updateUser(currentUser._id, values).then(() => {
        toast({
          title: 'Enregistré avec succès',
          position: 'top-right',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      })
    } else {
      // create
      createUser(values).then(() => {
        toast({
          title: 'Utilisateur créé !',
          description: "Un mail d'accès lui a été envoyé",
          position: 'top-right',
          status: 'success',
          duration: 4000,
        })
      })
    }
  }

  return (
    <Layout background='beige'>
      <Container maxW='container.xl' py={4}>
        <AjouterUtilisateur {...ajouterUserPopup} {...currentUser} handleSave={saveUser} />
        <Box pt={3}>
          <Breadcrumb separator={<ArrowDropRightLine color='grey.600' />} textStyle='xs'>
            <BreadcrumbItem>
              <BreadcrumbLink textDecoration='underline' as={Link} to='/' textStyle='xs'>
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='#' textStyle='xs'>
                Gestion des utilisateurs
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Flex alignItems='center'>
          <Box textStyle='h3' fontSize={['sm', '3xl']} fontWeight='700' color='grey.800' py={3}>
            Gestion des utilisateurs
          </Box>
          <Spacer />
          <Button variant='primary' rightIcon={<IoIosAddCircleOutline />} px={6} onClick={() => addUser()}>
            Ajouter un utilisateur
          </Button>
        </Flex>

        <MyTable users={users} editUser={editUser} />
      </Container>
    </Layout>
  )
}
