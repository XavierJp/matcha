import { Badge, Box, Button, Flex, Heading, Link, Spacer, Stack, Text, Tooltip } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useAuth from '../../../common/hooks/useAuth'
import { willExpire } from '../../../common/utils/dateUtils'
import {
  ArrowRightLine,
  BlocNote,
  Clock,
  Edit2Fill,
  ExclamationCircle,
  Repeat,
  SendPlaneFill,
  Trash,
} from '../../../theme/components/icons'

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
                <Heading textStyle='h3' size='md' pr={3}>
                  <Text isTruncated>{item.libelle}</Text>
                </Heading>
                <Flex align='center' pr={5}>
                  <Edit2Fill mr={3} color='bluefrance.500' />
                  <Link fontSize='16px' onClick={() => props.editOffer(item)} color='bluefrance.500'>
                    Modifier l'offre
                  </Link>
                </Flex>
                <Spacer />
                <Flex alignItems='center' display={['none', 'block']}>
                  <Link
                    color='bluefrance.500'
                    isExternal
                    href={`https://labonnealternance.apprentissage.beta.gouv.fr/recherche-apprentissage-formation?&caller=matcha&romes=${item.romes}&lon=${lon}&lat=${lat}`}
                  >
                    Voir les centres de formations
                    <ArrowRightLine ml={1} color='bluefrance.500' />
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
                  <Text>
                    <Flex>
                      Expire
                      {expire ? (
                        <Text color='redmarianne' ml={1}>
                          {dayjs().to(item.date_expiration)}
                        </Text>
                      ) : (
                        dayjs().to(item.date_expiration)
                      )}
                    </Flex>
                  </Text>
                </Flex>
              </Stack>

              <Stack direction={['column', 'row']} spacing={5} align='flex-start' mt={5}>
                <Tooltip
                  hasArrow
                  label="Disponible une semaine avant l'expiration de l'offre"
                  placement='top-end'
                  isDisabled={expire}
                >
                  <Flex align='center'>
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
                  <Trash w='19px' h='19px' mr={3} color='bluefrance.500' />
                  <Link fontSize='16px' onClick={() => props.removeOffer(item)} color='bluefrance.500'>
                    Supprimer l'offre
                  </Link>
                </Flex>

                {auth.type === 'ENTREPRISE' && (
                  <Tooltip
                    hasArrow
                    label='Assurez-vous de trouver le bon apprenti(e) en transmettant votre besoin auprès des OF (organismes de formation) de votre région.'
                    placement='top-start'
                    isDisabled={expire}
                  >
                    <Box>
                      <Button
                        variant='link'
                        sx={{
                          color: 'bluefrance.500',
                          fontWeight: 400,
                        }}
                        w={['100%', 'inherit']}
                        isDisabled={item.delegate}
                        leftIcon={<SendPlaneFill w='20px' h='20px' />}
                        onClick={() => props.delegateOffer(item._id, { ...item, delegate: true })}
                      >
                        Déléguer l'offre
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
