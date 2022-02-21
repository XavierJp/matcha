import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link as ChakraLink,
  Stack,
  Text,
  useBreakpointValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { memo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { createPartenaire } from '../../api'
import { AnimationContainer, InfoTooltip } from '../../components'
import { ArrowRightLine, InfoCircle } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'
import CustomSelect from '../formulaire/components/CustomSelect'
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
            modifier celle-ci,{' '}
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
  const { raison_sociale, adresse, contacts, siret, geo_coordonnees, uai, opco } = location.state?.informationSiret
  const { type, origine } = location.state

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    // save info if not trusted from source
    createPartenaire(values)
      .then(({ data }) => {
        if (type === 'ENTREPRISE') {
          // Dépot simplifié
          navigate('/creation/offre', {
            replace: true,
            state: { id_form: data.formulaire.id_form, email: data.user.email },
          })

          /**
           * Comportement précédent : authentification de l'utilisateur et redirection vers son formulaire, popup offre ouverte
           *
           * navigate(`/authentification/verification?token=${data.token}`, {
           *   replace: true,
           *   state: { fromEntrepriseCreation: true },
           * })
           *
           **/
        } else {
          navigate('/authentification/confirmation', { replace: true, state: { email: data.email } })
        }
        setSubmitting(false)
      })
      .catch((error) => {
        setFieldError('email', error.response.data.message)
        setSubmitting(false)
      })
  }

  return (
    <Formik
      validateOnMount={true}
      initialValues={{
        siret: siret,
        raison_sociale: raison_sociale,
        adresse: adresse,
        contacts: contacts,
        geo_coordonnees: geo_coordonnees,
        uai: uai,
        opco: opco,
        type: type,
        origine: origine ?? 'matcha',
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
              helper="Le numéro de téléphone sera visible sur l'offre d'emploi"
              value={informationForm.values.telephone}
            />
            {/* Quick fix */}
            <CustomInput
              required={false}
              name='email'
              label='Email'
              type='email'
              value={informationForm.values.email}
              info='Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Privilégiez votre adresse professionnelle'
            />
            {/* <ContactField values={informationForm.values} /> */}
            <Flex justifyContent='flex-end' alignItems='center' mt={5}>
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
        )
      }}
    </Formik>
  )
}

const InformationLegale = () => {
  let location = useLocation()
  const { raison_sociale, uai, rue, siret, commune, code_postal, opco } = location.state?.informationSiret
  const { type } = location.state

  const RAISON_SOCIALE = raison_sociale.length > 30 ? raison_sociale.substring(0, 30) + '...' : raison_sociale

  return (
    <Box border='1px solid #000091' p={5}>
      <Heading mb={3} fontSize='2xl'>
        Informations légales
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
          {type === 'ENTREPRISE' ? (
            <InfoTooltip description='La donnée “SIRET Organisme”  provient de l’INSEE puis est déduite du SIREN. Si cette information est erronée, merci de leur signaler.' />
          ) : (
            <InfoTooltip description='La donnée “SIRET Organisme”  provient des bases “Carif-Oref”. Si cette information est erronée, merci de le signaler au Carif-Oref de votre région.' />
          )}
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
            {rue}
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
        {opco && (
          <Flex align='center'>
            <Text mr={3}>Opco de référence :</Text>
            <Badge mr={3} fontSize='md' maxW='50%'>
              <Text isTruncated>{opco}</Text>
            </Badge>
            <InfoTooltip description='La donnée "Opco" provient de CFADOCK puis est déduite du SIRET. Si cette information est erronée, merci de leur signaler.' />
          </Flex>
        )}
        {uai && (
          <Flex align='flex-start'>
            <Text width='45px' mr={3}>
              UAI :
            </Text>
            <Wrap maxW='450px'>
              {uai.map((x) => (
                <WrapItem>
                  <Badge mr={3} fontSize='md' key={x}>
                    {x}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
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
    <AnimationContainer>
      <AuthentificationLayout>
        <Grid templateRows={['1fr', '.5fr 2fr']} templateColumns={['1fr', '4fr 5fr']} gap={4}>
          <GridItem px={[4, 8]} pt={[6, 12]}>
            <Heading fontSize='32px'>
              {type === 'ENTREPRISE' ? 'Vos informations de contact' : 'Créez votre compte sur Matcha'}
            </Heading>
            <Text fontSize='20px' pt='32px'>
              Ces informations seront visibles sur vos offres et vous permettront de recevoir les différentes
              candidatures.
            </Text>
          </GridItem>
          <GridItem rowStart={2} p={[4, 8]}>
            <Formulaire />
          </GridItem>
          <GridItem rowStart={['auto', 2]} pt={[4, 8]} px={[4, 'auto']}>
            <InformationLegale />
          </GridItem>
        </Grid>
      </AuthentificationLayout>
    </AnimationContainer>
  )
}
