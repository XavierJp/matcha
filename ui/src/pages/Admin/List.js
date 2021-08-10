import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { AiOutlineEdit, AiOutlineRight, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
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
  Text,
  Badge,
  useEditableControls,
  Editable,
  EditablePreview,
  EditableInput,
  ButtonGroup,
  IconButton,
  useToast,
  Select,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
} from '@chakra-ui/react'

import { AnimationContainer, Layout } from '../../components'
import useAuth from '../../common/hooks/useAuth'
import { getWithQS, putFormulaire } from '../../api'

const EditableField = ({ id_form, value }) => {
  const toast = useToast()

  const handleEditableSubmit = (value) => {
    putFormulaire(id_form, { origine: value }).then(() =>
      toast({
        title: 'Enregistré avec succès',
        position: 'top-right',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    )
  }

  const EditableControls = () => {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls()

    return isEditing ? (
      <ButtonGroup justifyContent='center' size='sm'>
        <IconButton icon={<AiOutlineCheck />} {...getSubmitButtonProps()} />
        <IconButton icon={<AiOutlineClose />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <IconButton size='sm' color='bluefrance.500' icon={<AiOutlineEdit />} {...getEditButtonProps()} />
    )
  }

  return (
    <Editable defaultValue={value} onSubmit={handleEditableSubmit} isPreviewFocusable={false}>
      <Flex alignItems='center' justify='center'>
        <EditablePreview />
        <EditableInput />
        <Box ml={6}>
          <EditableControls />
        </Box>
      </Flex>
    </Editable>
  )
}

const MyTable = ({ formulaires }) => {
  if (formulaires.length < 0) return <div>Chargement en cours</div>

  const Date = (date) => moment(date).format('DD/MM/YYYY')

  return (
    <Box py='4'>
      <Table size='sm' bg='white'>
        <Thead borderBottom='2px solid grey'>
          <Th py={6} paddingLeft='30px'>
            Raison Sociale
          </Th>
          <Th>Origine</Th>
          <Th>Nombre d'offre.s (active.s)</Th>
          <Th>Contact</Th>
          <Th>Email</Th>
          <Th>Téléphone</Th>
          <Th>Accès formulaire</Th>
        </Thead>
        <Tbody>
          {formulaires?.map((item, index) => {
            let active = item.offres.filter((x) => x.statut === 'Active')
            return (
              <Tr key={index}>
                <Td py={4} paddingLeft='30px'>
                  {item.raison_sociale}
                  <Text>
                    <Badge>{item.siret}</Badge>
                  </Text>
                </Td>
                <Td>
                  <EditableField key={item.origine} value={item.origine} id_form={item.id_form} />
                </Td>
                <Td>
                  <Center>
                    {item.offres.length} / ({active.length})
                  </Center>
                </Td>
                <Td>
                  {item.prenom?.toLowerCase().charAt(0).toUpperCase() + item.prenom?.slice(1)} {item.nom?.toUpperCase()}
                </Td>
                <Td maxW='250px'>
                  <Text isTruncated>{item.email}</Text>
                </Td>
                <Td>{item.telephone}</Td>
                <Td>
                  <Center>
                    <Link to={`/formulaire/${item.id_form}`} target='_blank'>
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

export default function List() {
  const [state, setState] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [auth] = useAuth()

  let scope =
    auth.scope === 'all'
      ? {
          $nor: [{ offres: { $exists: false } }, { offres: { $size: 0 } }],
        }
      : {
          $nor: [{ offres: { $exists: false } }, { offres: { $size: 0 } }],
          origine: { $regex: auth.scope },
        }

  const [query, setQuery] = useState(scope)

  const handleFilter = (filter) => {
    setFilter(filter)
    setLoading(true)
    setQuery({
      $nor: [{ offres: { $exists: false } }, { offres: { $size: 0 } }],
      origine: { $regex: filter },
    })
  }

  useEffect(() => {
    getWithQS({ query, limit: 10000 })
      .then((formulaires) => setState(formulaires.data))
      .finally(() => setLoading(false))
  }, [query])

  if (loading) {
    return (
      <Layout>
        <Center h='100vh'>Chargement en cours...</Center>
      </Layout>
    )
  }

  return (
    <AnimationContainer>
      <Layout background='beige'>
        <Container maxW='container.xl' py={4}>
          <Breadcrumb spacing='4px' separator={<AiOutlineRight />} textStyle='xs'>
            <BreadcrumbItem>
              <BreadcrumbLink textDecoration='underline' as={Link} to='/' textStyle='xs'>
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='#' textStyle='xs'>
                Administration des offres
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Flex alignItems='center'>
            <Box textStyle='h3' fontSize={['sm', '3xl']} fontWeight='700' color='grey.800' py={3}>
              Offre(s) de l'organisation : {auth.organisation}
            </Box>
            <Spacer />
            <Text>
              <Badge variant='outline'>{state.stats.nbFormulaires}</Badge> formulaires dont{' '}
              <Badge variant='outline'>{state.stats.nbOffres}</Badge> offres
            </Text>
          </Flex>

          {auth.permissions.isAdmin && (
            <Grid templateColumns='1fr 3fr'>
              <GridItem>
                <FormControl>
                  <FormLabel>Filtrer par origine</FormLabel>
                  <Select value={filter} onChange={(e) => handleFilter(e.target.value)}>
                    <option value=''>Toutes les offres</option>
                    <option value='lbb'>LBB</option>
                    <option value='opco2i'>Opco 2i</option>
                    <option value='1J1S'>1J1S</option>
                    <option value='matcha'>Matcha</option>
                    <option value='lba'>LBA</option>
                  </Select>
                </FormControl>
              </GridItem>
              <Spacer />
            </Grid>
          )}

          <MyTable formulaires={state.data} />
        </Container>
      </Layout>
    </AnimationContainer>
  )
}
