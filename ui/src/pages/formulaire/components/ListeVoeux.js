import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useAuth from '../../../common/hooks/useAuth'
import { willExpire } from '../../../common/utils/dateUtils'
import {
  BlocNote,
  Clock,
  Edit2Fill,
  ExclamationCircle,
  ExternalLinkLine,
  NavVerticalDots,
  Repeat,
  SendPlaneFill,
  Trash,
} from '../../../theme/components/icons'

const Card = ({ offre, ...props }) => {
  const [auth] = useAuth()

  const [lat, lon] = props.geo_coordonnees.split(',')

  return (
    <>
      {offre.map((offre) => {
        const expire = willExpire(offre.date_expiration)

        return (
          <Box bg='white' p={8} border='1px solid' borderColor='bluefrance.500' key={offre._id}>
            {offre.candidatures && (
              <Badge sx={{ py: '6px', px: '16px', borderRadius: '40px', backgroundColor: '#E3E3FD', color: '#000091' }}>
                {offre.candidatures} {offre.candidatures > 1 ? 'candidatures' : 'candidature'}
              </Badge>
            )}
            <Flex align='center' direction={['column', 'row']}>
              <Heading textStyle='h3' size='md' pr={3}>
                <Text isTruncated>{offre.libelle}</Text>
              </Heading>
              <Flex align='center' ml={10}>
                <Edit2Fill mr={3} color='bluefrance.500' />
                <Link fontSize='16px' onClick={() => props.editOffer(offre)} color='bluefrance.500'>
                  Modifier l'offre
                </Link>
              </Flex>
              <Spacer />

              <Menu>
                {({ isOpen }) => (
                  <>
                    <MenuButton isActive={isOpen} as={Button} variant='navdot'>
                      <Icon as={NavVerticalDots} w='16px' h='16px' />
                    </MenuButton>
                    <MenuList>
                      {auth.type !== 'CFA' && (
                        <>
                          <MenuItem>
                            <Link
                              color='bluefrance.500'
                              isExternal
                              href={`https://labonnealternance.apprentissage.beta.gouv.fr/recherche-apprentissage-formation?&caller=matcha&romes=${offre.romes}&lon=${lon}&lat=${lat}`}
                            >
                              Voir les centres de formations
                            </Link>
                          </MenuItem>
                          <MenuDivider />
                        </>
                      )}
                      <MenuItem>
                        <Link
                          color='bluefrance.500'
                          isExternal
                          href={`https://labonnealternance${
                            window.location.href.includes('recette') ? '-recette' : ''
                          }.apprentissage.beta.gouv.fr/recherche-apprentissage?&type=matcha&itemId=${offre._id}`}
                        >
                          Voir l'offre en ligne
                          <ExternalLinkLine ml={1} color='bluefrance.500' />
                        </Link>
                      </MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu>
            </Flex>
            <Stack direction={['column', 'row']} spacing={3} py={5}>
              <Flex align='center'>
                <BlocNote color='bluefrance.500' w='18px' h='22px' mr={2} />
                <Text>
                  {offre.type} en {offre.niveau}
                </Text>
              </Flex>
              <Flex align='center'>
                <Clock color='bluefrance.500' w='18px' h='22px' mr={2} />
                <Text> Postée le {dayjs(offre.date_creation).format('DD/MM/YYYY')}</Text>
              </Flex>
              <Flex align='center'>
                <ExclamationCircle color='bluefrance.500' mr={2} w='20px' h='20px' />
                <Text>
                  <Flex>
                    Expire
                    {expire ? (
                      <Text color='redmarianne' ml={1}>
                        {dayjs().to(offre.date_expiration)}
                      </Text>
                    ) : (
                      <Text ml={1}>{dayjs().to(offre.date_expiration)}</Text>
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
                      props.extendOffer(offre._id, {
                        ...offre,
                        date_expiration: dayjs().add(1, 'month').format('YYYY-MM-DD'),
                        date_derniere_prolongation: Date(),
                        nombre_prolongation: offre.nombre_prolongation >= 0 ? offre.nombre_prolongation + 1 : 1,
                      })
                    }
                  >
                    Prolonger l'échéance
                  </Button>
                </Flex>
              </Tooltip>
              <Flex align='center'>
                <Trash w='19px' h='19px' mr={3} color='bluefrance.500' />
                <Link fontSize='16px' onClick={() => props.removeOffer(offre)} color='bluefrance.500'>
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
                      isDisabled={offre.delegate}
                      leftIcon={<SendPlaneFill w='20px' h='20px' />}
                      onClick={() => props.delegateOffer(offre._id, { ...offre, delegate: true })}
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
    </>
  )
}

export default (props) => {
  dayjs.extend(relativeTime)

  if (!props.data) {
    return <div />
  }

  const offreActive = props.data.filter((x) => {
    if (x.statut === 'Active' && willExpire(x.date_expiration) === false) {
      return x
    }
  })
  const offreActiveNbr = offreActive.length

  const offreToExpire = props.data.filter((x) => {
    if (willExpire(x.date_expiration) && x.statut === 'Active') {
      return x
    }
  })
  const offreToExpireNbr = offreToExpire.length

  return (
    <>
      {offreToExpireNbr > 0 && (
        <>
          <Text fontWeight='700' fontSize='24px' mb={3}>
            {offreToExpireNbr > 1
              ? `${offreToExpireNbr} Offres arrivant à expiration`
              : `${offreToExpireNbr} Offre arrive à expiration`}
          </Text>
          <Stack direction='column' align='stretch' spacing={3} mb={10}>
            <Card offre={offreToExpire} {...props} />
          </Stack>
        </>
      )}

      {offreActiveNbr > 0 && (
        <>
          <Text fontWeight='700' fontSize='24px' mb={3}>
            {offreActiveNbr > 1 ? `${offreActiveNbr} Offres actives` : `${offreActiveNbr} Offre active`}
          </Text>
          <Stack direction='column' align='stretch' spacing={3}>
            <Card offre={offreActive} {...props} />
          </Stack>
        </>
      )}
    </>
  )
}
