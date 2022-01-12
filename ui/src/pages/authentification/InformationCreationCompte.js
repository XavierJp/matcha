import {
  Heading,
  Text,
  Flex,
  useBreakpointValue,
  Button,
  Link as ChakraLink,
  Stack,
  Box,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react'
import { memo } from 'react'
import { Form, Formik } from 'formik'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { createPartenaire } from '../../api'

import { ArrowRightLine, InfoCircle } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'
import CustomSelect from '../formulaire/components/CustomSelect'
import { AnimationContainer, InfoTooltip } from '../../components'
import AuthentificationLayout from './components/Authentification-layout'

const ContactField = memo(({ values }) => {
  let hasTrusties = Boolean(values.contacts.filter((c) => c.confirmé === true).length)

  if (values.contacts.length > 1 && hasTrusties) {
    return (
      <CustomSelect
        name='email'
        label='Email'
        type='email'
        placeholder='Selectionnez une adresse mail disponible'
        info={
          <>
            Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Si vous souhaitez ajouter, corriger ou
            modifier celles-ci,{' '}
            <ChakraLink href='mailto:contact@matcha.apprentissage.beta.gouv.fr' textDecoration='underline'>
              contactez l’équipe ici
            </ChakraLink>
          </>
        }
      >
        {values.contacts.map((c) => (
          <option key={c.email} value={c.email} disabled={!c.confirmé}>
            {c.email}
          </option>
        ))}
      </CustomSelect>
    )
  }

  if (values.contacts.length === 1) {
    return (
      <CustomInput
        required={false}
        name='email'
        label='Email'
        type='email'
        value={values.email}
        info='Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Vérifiez qu’elle soit correcte ou bien modifiez-là'
      />
    )
  }

  return (
    <CustomInput
      required={false}
      name='email'
      label='Email'
      type='email'
      value={values.email}
      info='Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Privilégiez votre adresse professionnelle'
    />
  )
})

const Formulaire = () => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  let navigate = useNavigate()
  let location = useLocation()
  const { raison_sociale, adresse, contacts, siret, geo_coordonnees, uai } = location.state?.informationSiret
  const { type } = location.state

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    // save info if not trusted from source
    createPartenaire(values)
      .then(({ data }) => {
        if (type === 'ENTREPRISE') {
          navigate(`/authentification/verification?token=${data.token}`, { state: { fromEntrepriseCreation: true } })
        } else {
          navigate('/authentification/confirmation', { state: { email: data.email } })
        }
        setSubmitting(false)
      })
      .catch((error) => {
        setFieldError('email', error.response.data.message)
        setSubmitting(false)
      })
  }

  return (
    <>
      <Formik
        validateOnMount={true}
        initialValues={{
          siret: siret,
          raison_sociale: raison_sociale,
          adresse: adresse,
          contacts: contacts,
          geo_coordonnees: geo_coordonnees,
          uai: uai,
          type: type,
          nom: undefined,
          prenom: undefined,
          telephone: undefined,
          email: contacts.length === 1 ? contacts[0].email : undefined,
        }}
        validationSchema={Yup.object().shape({
          raison_sociale: Yup.string().required('champs obligatoire'),
          siret: Yup.string()
            .matches(/^[0-9]+$/, 'Le siret est composé uniquement de chiffres')
            .min(14, 'le siret est sur 14 chiffres')
            .max(14, 'le siret est sur 14 chiffres')
            .required('champs obligatoire'),
          adresse: Yup.string().required('champ obligatoire'),
          email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
          nom: Yup.string().required('champ obligatoire'),
          prenom: Yup.string().required('champ obligatoire'),
          telephone: Yup.string()
            .matches(/^[0-9]+$/, 'Le téléphone est composé uniquement de chiffres')
            .min(10, 'le téléphone est sur 10 chiffres')
            .max(10, 'le téléphone est sur 10 chiffres')
            .required('champ obligatoire'),
        })}
        onSubmit={submitForm}
      >
        {(informationForm) => {
          return (
            <Box maxW='90%'>
              <Form>
                <CustomInput required={false} name='nom' label='Nom' type='text' value={informationForm.values.nom} />
                <CustomInput
                  required={false}
                  name='prenom'
                  label='Prénom'
                  type='text'
                  value={informationForm.values.prenom}
                />
                <CustomInput
                  required={false}
                  name='telephone'
                  label='Numéro de téléphone'
                  type='tel'
                  pattern='[0-9]{10}'
                  maxLength='10'
                  value={informationForm.values.telephone}
                />
                <ContactField values={informationForm.values} />
                <Flex justifyContent='flex-end' alignItems='center' pt={8}>
                  <ChakraLink as={Link} size={buttonSize} variant='secondary' mr={5} to='/'>
                    Annuler
                  </ChakraLink>
                  <Button
                    type='submit'
                    size={buttonSize}
                    variant='form'
                    leftIcon={<ArrowRightLine width={5} />}
                    isActive={informationForm.isValid}
                    isDisabled={!informationForm.isValid || informationForm.isSubmitting}
                  >
                    Suivant
                  </Button>
                </Flex>
              </Form>
            </Box>
          )
        }}
      </Formik>
    </>
  )
}

const InformationLegale = () => {
  let location = useLocation()
  const { raison_sociale, uai, adresse, siret, commune, code_postal } = location.state?.informationSiret

  const RAISON_SOCIALE = raison_sociale.length > 30 ? raison_sociale.substring(0, 30) + '...' : raison_sociale

  return (
    <Box border='1px solid #000091' p={5} pb={12} h='100%'>
      <Heading mb={3} fontSize='2xl'>
        Information légales
      </Heading>
      <Flex alignItems='flex-start' alignItems='flex-start' mb={10}>
        <InfoCircle mr={2} mt={1} />
        <Text>Vérifiez que les informations pré-remplies soient correctes avant de continuer.</Text>
      </Flex>
      <Stack direction='column' spacing={7}>
        <Flex align='center'>
          <Text mr={3}>SIRET :</Text>
          <Badge mr={3} fontSize='md'>
            {siret}
          </Badge>
          <InfoTooltip description='La donnée “SIRET Organisme”  provient des bases “Carif-Oref”. Si cette information est erronée, merci de le signaler au Carif-Oref de votre région.' />
        </Flex>
        <Flex align='center'>
          <Text mr={3}>Raison sociale :</Text>
          <Badge mr={3} fontSize='md'>
            {RAISON_SOCIALE}
          </Badge>
          <InfoTooltip description='La donnée “Raison sociale” provient de l’INSEE puis est déduite du SIREN. Si cette information est erronée, merci de leur signaler.' />
        </Flex>{' '}
        <Flex align='center'>
          <Text mr={3}>Adresse :</Text>
          <Badge mr={3} fontSize='md'>
            {adresse}
          </Badge>
          <InfoTooltip description='La donnée “Adresse” provient de l’INSEE puis est déduite du SIRET. Si cette information est erronée, merci de leur signaler.' />
        </Flex>{' '}
        <Flex align='center'>
          <Text mr={3}>Code postal :</Text>
          <Badge mr={3} fontSize='md'>
            {code_postal}
          </Badge>
          <InfoTooltip description='La donnée “Adresse” provient de l’INSEE puis est déduite du SIRET. Si cette information est erronée, merci de leur signaler.' />
        </Flex>{' '}
        <Flex align='center'>
          <Text mr={3}>Commune :</Text>
          <Badge mr={3} fontSize='md'>
            {commune}
          </Badge>
          <InfoTooltip description='La donnée “Adresse” provient de l’INSEE puis est déduite du SIRET. Si cette information est erronée, merci de leur signaler.' />
        </Flex>
        {uai && (
          <Flex align='center'>
            <Text mr={3}>UAI :</Text>
            {uai.map((x) => (
              <Badge mr={3} fontSize='md' key={x.uai}>
                {x}
              </Badge>
            ))}
            <InfoTooltip description='"La donnée “UAI” est collectée au niveau des Carif-Oref ou renseignée par la Mission apprentissage. Une modification de l’UAI peut donc entraîner un changement de statut des formations qui s’y rattachent, et ainsi les rendre éligibles.' />
          </Flex>
        )}
      </Stack>
    </Box>
  )
}

export default () => {
  let location = useLocation()
  const { type } = location.state

  return (
    <AuthentificationLayout>
      <Box pb={10}>
        <AnimationContainer>
          <Box w={['100%', '50%']} pb={12} pt={12} px={['6', '8']}>
            <Heading fontSize='32px' pb={3}>
              {type === 'ENTREPRISE' ? 'Vos informations de contact' : 'Créez votre compte sur Matcha'}
            </Heading>
            <Text fontSize='xl'>Vérifiez vos informations légales et renseignez vos informations de contact.</Text>
          </Box>
          <Box px={['6', '8']}>
            <SimpleGrid columns={['1', '2']} gap={10} flex='1' alignItems='center'>
              <Formulaire />
              <InformationLegale />
            </SimpleGrid>
          </Box>
        </AnimationContainer>
      </Box>
    </AuthentificationLayout>
  )
}
