import { Flex, Box, Text, Heading, Spacer, Link, Stack } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { InfoCircle } from '../../../theme/components/icons'
import { MailCloud } from '../../../theme/components/logos'
import AuthentificationLayout from '../../authentification/components/Authentification-layout'
import dayjs from 'dayjs'

export default (props) => {
  const location = useLocation()

  const { offre, email } = location.state

  return (
    <AuthentificationLayout>
      <Flex border='1px solid #000091' m={[4, 8]} p={[4, 8]}>
        <MailCloud />
        <Spacer />
        <Box>
          <Heading fontSize='24px' mb='16px'>
            Félicitations, votre offre a bien été créé!
          </Heading>
          <Flex alignItems='flex-start' mb={6}>
            <InfoCircle mr={2} mt={1} />
            <Text textAlign='justify'>
              Afin de finaliser la diffusion de votre besoin auprès des jeunes et vous connectez à votre espace de
              gestion, <span style={{ fontWeight: '700' }}>veuillez valider votre adresse mail</span> en cliquant sur le
              lien que nous venons de vous transmettre à l’adresse suivante:{' '}
              <span style={{ fontWeight: '700' }}>{email}</span>.
            </Text>
          </Flex>
          <Box ml={5} mb='16px'>
            <Text>
              Vous n’avez pas reçu le mail ?{' '}
              <Link variant='classic' onClick={() => {}}>
                Renvoyer le mail
              </Link>
            </Text>
          </Box>
          <Stack direction='column' spacing='16px'>
            <Heading fontSize='20px'>Récapitulatif de votre besoin</Heading>
            <Text>{offre.libelle}</Text>
            <Text>{offre.niveau}</Text>
            <Text>
              Date de début d'apprentissage souhaité : {dayjs(offre.date_debut_apprentissage).format('DD/MM/YYYY')}
            </Text>
            <Text fontSize='14px'>Votre annonce sera visible pendant 30 jours, renouvelable.</Text>
          </Stack>
        </Box>
      </Flex>
    </AuthentificationLayout>
  )
}
