import { Box, Button, Flex, Heading, Link, Spacer, Stack, Text, useToast } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { sendMagiclink } from '../../../api'
import { InfoCircle } from '../../../theme/components/icons'
import { MailCloud } from '../../../theme/components/logos'
import AuthentificationLayout from '../../authentification/components/Authentification-layout'

export default (props) => {
  const location = useLocation()
  const [disableLink, setDisableLink] = useState(false)
  const toast = useToast()

  const { offre, email } = location.state

  const resendMail = (email) => {
    sendMagiclink({ email }).catch(() => {
      toast({
        title: 'Email envoyé.',
        description: "Un lien d'activiation personnalisé vous a été envoyé par mail.",
        position: 'top-right',
        status: 'success',
        duration: 5000,
      })
      setDisableLink(true)
    })
  }

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
          <Flex align='center' ml={5} mb='16px'>
            <Text>Vous n’avez pas reçu le mail ? </Text>
            <Button
              as={Link}
              variant='classic'
              textDecoration='underline'
              onClick={() => resendMail(email)}
              isDisabled={disableLink}
            >
              Renvoyer le mail
            </Button>
          </Flex>
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
