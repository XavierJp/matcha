import { Button, Box, Flex, Text, Heading, Spacer, Icon, Badge, VStack, Stack, Tooltip, Link } from '@chakra-ui/react'
import {
  AiOutlineEdit,
  AiOutlineExclamationCircle,
  AiOutlineDelete,
  AiOutlineArrowRight,
  AiOutlineRetweet,
} from 'react-icons/ai'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

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

  if (!props.data) {
    return <div />
  }

  const [lat, lon] = props.geo_coordonnees.split(',')

  return (
    <Stack direction='column' align='stretch' spacing={3}>
      {props.data
        .filter((x) => x.statut === 'Active')
        .map((item) => {
          console.log({ expire: item.date_expiration, expireDayjs: dayjs().to(item.date_expiration, true) })

          let remainingDays = () => {
            if (dayjs().to(item.date_expiration, true) === 'un mois') {
              return 30
            }
            return dayjs().to(item.date_expiration, true)
          }
          let remainingDaysAsNumber = parseFloat(remainingDays(), 2)
          let isExtendable = remainingDaysAsNumber > 7 ? false : true

          return (
            <Box bg='white' p={8} border='1px solid' borderColor='bluefrance.500'>
              <Flex alignItems='flex-start'>
                <Text fontSize='sm' pr={9} pb={[3, 0]}>
                  Postée le {dayjs(item.date_creation).format('DD/MM/YYYY')}
                </Text>
                <Flex alignItems='center' pb={[3, 0]}>
                  <Icon as={AiOutlineExclamationCircle} color='bluefrance.500' w={5} h={5} />
                  <Text fontSize='sm' pl={3}>
                    Expire {dayjs().to(item.date_expiration)}
                  </Text>
                </Flex>
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
              <VStack spacing={2} align='flex-start' pt={3} pb={9}>
                <Heading textStyle='h3' size='md'>
                  {item.libelle}
                </Heading>
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
              </VStack>
              <Stack direction={['column', 'row']} spacing={3}>
                <Button variant='secondary' leftIcon={<AiOutlineEdit />} onClick={() => props.editOffer(item)}>
                  Modifier l'offre
                </Button>

                <Tooltip
                  hasArrow
                  label="Disponible une semaine avant l'expiration de l'offre"
                  placement='top'
                  isDisabled={isExtendable}
                >
                  <Box>
                    <Button
                      w={['100%', 'inherit']}
                      variant='secondary'
                      isDisabled={!isExtendable}
                      leftIcon={<AiOutlineRetweet />}
                      onClick={() =>
                        props.extendOffer(item._id, {
                          ...item,
                          date_expiration: dayjs().add(1, 'month').format('YYYY-MM-DD'),
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
                </Button>
              </Stack>
            </Box>
          )
        })}
    </Stack>
  )
}
