import { Badge, Box, Button, Flex, Icon, Link, Spacer, Stack, Text, Tooltip, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AiOutlineArrowRight, AiOutlineDelete, AiOutlineEdit, AiOutlineRetweet } from 'react-icons/ai'
import { RiSendPlaneFill } from 'react-icons/ri'
import useAuth from '../../../common/hooks/useAuth'
import { willExpire } from '../../../common/utils/dateUtils'
import { BlocNote, Edit2Fill, Clock, ExclamationCircle, Trash, Repeat } from '../../../theme/components/icons'

const getStatusBadge = (status) => {
  let [statut] = Object.keys(status).filter((x) => status[x])

  if (statut === 'filled') {
    return <Badge colorScheme='grey'>Offre pourvue</Badge>
  }

  if (statut === 'canceled') {
    return <Badge colorScheme='red'>Annulé</Badge>
  }

  if (statut === 'active') {
    return <Badge colorScheme='red'>Active</Badge>
  }
}

export default (props) => {
  dayjs.extend(relativeTime)
  const [auth] = useAuth()

  if (!props.data) {
    return <div />
  }

  const [lat, lon] = props.geo_coordonnees.split(',')

  return (
    <Stack direction='column' align='stretch' spacing={3}>
      {props.data
        .filter((x) => x.statut === 'Active')
        .map((item) => {
          const expire = willExpire(item.date_expiration)

          return (
            <Box bg='white' p={8} border='1px solid' borderColor='bluefrance.500' key={item._id}>
              <Flex alignItems='flex-start' direction={['column', 'row']}>
                <Badge
                  fontSize={['sm', 'md']}
                  sx={{
                    backgroundColor: '#E3E3FD',
                    borderRadius: '8px',
                    paddingX: '10px',
                    marginBottom: '8px',
                    marginRight: '32px',
                    maxWidth: '100%',
                  }}
                >
                  <Text isTruncated>{item.libelle}</Text>
                </Badge>
                {/* <Heading textStyle='h3' size='md'>
                  {item.libelle}
                </Heading> */}
                <Flex align='center' pr={5}>
                  <Edit2Fill mr={3} color='bluefrance.500' />
                  <Link fontSize='16px' onClick={() => props.editOffer(item)} color='bluefrance.500'>
                    Modifier l'offre
                  </Link>
                </Flex>
                {/* <Flex align='center' pr={5}>
                  <Edit2Fill mr={3} color='bluefrance.500' />
                  <Link fontSize='16px' onClick={() => props.editOffer(item)} color='bluefrance.500'>
                    Prolonger l'offre
                  </Link>
                </Flex>
                <Flex align='center'>
                  <Trash w='18px' mr={3} color='redmarianne' />
                  <Link fontSize='16px' onClick={() => props.editOffer(item)} color='redmarianne'>
                    Supprimer l'offre
                  </Link>
                </Flex> */}
                <Spacer />
                <Flex alignItems='center' display={['none', 'block']}>
                  <Link
                    color='bluefrance.500'
                    isExternal
                    href={`https://labonnealternance.apprentissage.beta.gouv.fr/recherche-apprentissage-formation?&caller=matcha&romes=${item.romes}&lon=${lon}&lat=${lat}`}
                  >
                    Voir les centres de formations
                    <Icon ml={1} as={AiOutlineArrowRight} color='bluefrance.500' />
                  </Link>
                </Flex>
              </Flex>
              <Stack direction={['column', 'row']} spacing={3} py={5}>
                <Flex align='center'>
                  <BlocNote color='bluefrance.500' w='18px' h='22px' mr={2} />
                  <Text>
                    {item.type} en {item.niveau}
                  </Text>
                </Flex>
                <Flex align='center'>
                  <Clock color='bluefrance.500' w='18px' h='22px' mr={2} />
                  <Text> Postée le {dayjs(item.date_creation).format('DD/MM/YYYY')}</Text>
                </Flex>
                <Flex align='center'>
                  <ExclamationCircle color='bluefrance.500' mr={2} w='20px' h='20px' />
                  <Text> Expire {dayjs().to(item.date_expiration)}</Text>
                </Flex>
              </Stack>
              {/* <VStack spacing={2} align='flex-start' pt={3} pb={9}>
                <Flex direction={['column', 'row']}>
                  <Text fontSize='md' fontWeight='400' pr={1}>
                    Niveau:
                  </Text>
                  <Text fontWeight='600'>{item.niveau}</Text>
                </Flex>
                <Flex direction={['column', 'row']}>
                  <Text fontSize='md' fontWeight='400' pr={1}>
                    Type de contrat:
                  </Text>
                  <Text fontWeight='600'>{item.type}</Text>
                </Flex>
                {item.date_debut_apprentissage && (
                  <Flex direction={['column', 'row']}>
                    <Text fontSize='md' fontWeight='400' pr={1}>
                      Date de début du contrat:
                    </Text>
                    <Text fontWeight='600'>{dayjs(item.date_debut_apprentissage).format('DD/MM/YYYY')}</Text>
                  </Flex>
                )}
              </VStack> */}
              <Stack direction={['column', 'row']} spacing={5} align='flex-start'>
                {/* <Button variant='secondary' leftIcon={<AiOutlineEdit />} onClick={() => props.editOffer(item)}>
                  Modifier l'offre
                </Button> */}

                <Tooltip
                  hasArrow
                  label="Disponible une semaine avant l'expiration de l'offre"
                  placement='top'
                  isDisabled={expire}
                >
                  <Flex align='center' pr={5}>
                    <Button
                      w={['100%', 'inherit']}
                      variant='link'
                      sx={{
                        color: 'bluefrance.500',
                        fontWeight: 400,
                      }}
                      isDisabled={!expire}
                      leftIcon={<Repeat w='20px' h='20px' color='bluefrance.500' />}
                      onClick={() =>
                        props.extendOffer(item._id, {
                          ...item,
                          date_expiration: dayjs().add(1, 'month').format('YYYY-MM-DD'),
                          date_derniere_prolongation: Date(),
                          nombre_prolongation: item.nombre_prolongation >= 0 ? item.nombre_prolongation + 1 : 1,
                        })
                      }
                    >
                      Prolonger l'échéance
                    </Button>
                  </Flex>
                </Tooltip>
                <Flex align='center'>
                  <Trash w='20px' h='20px' mr={3} color='redmarianne' />
                  <Link fontSize='16px' onClick={() => props.editOffer(item)} color='redmarianne'>
                    Supprimer l'offre
                  </Link>
                </Flex>

                {/* <Tooltip
                  hasArrow
                  label="Disponible une semaine avant l'expiration de l'offre"
                  placement='top'
                  isDisabled={expire}
                >
                  <Box>
                    <Button
                      w={['100%', 'inherit']}
                      variant='secondary'
                      isDisabled={!expire}
                      leftIcon={<AiOutlineRetweet />}
                      onClick={() =>
                        props.extendOffer(item._id, {
                          ...item,
                          date_expiration: dayjs().add(1, 'month').format('YYYY-MM-DD'),
                          date_derniere_prolongation: Date(),
                          nombre_prolongation: item.nombre_prolongation >= 0 ? item.nombre_prolongation + 1 : 1,
                        })
                      }
                    >
                      Prolonger l'échéance
                    </Button>
                  </Box>
                </Tooltip>
                <Button
                  variant='outline'
                  color='redmarianne'
                  borderColor='redmarianne'
                  borderRadius='none'
                  fontWeight='400'
                  leftIcon={<AiOutlineDelete />}
                  _focus={{
                    boxShadow: '0px 0px 0px 3px #E1000F',
                  }}
                  onClick={() => props.removeOffer(item)}
                >
                  Supprimer l'offre
                </Button> */}
                {auth.type === 'ENTREPRISE' && (
                  <Tooltip
                    hasArrow
                    label='Assurez-vous de trouver le bon apprenti(e) en transmettant votre besoin auprès des OF (organismes de formation) de votre région.'
                    placement='top'
                    isDisabled={expire}
                  >
                    <Box>
                      <Button
                        w={['100%', 'inherit']}
                        variant='secondary'
                        isDisabled={item.delegate}
                        leftIcon={<RiSendPlaneFill />}
                        onClick={() => props.delegateOffer(item._id, { ...item, delegate: true })}
                      >
                        Déléger l'offre
                      </Button>
                    </Box>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          )
        })}
    </Stack>
  )
}
