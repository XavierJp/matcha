import {
  Container,
  Flex,
  Image,
  Button,
  GridItem,
  Heading,
  Text,
  Box,
  SimpleGrid,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react'

import { useHistory } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { Close, SearchLine, ArrowRightLine } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'
import logo from '../../assets/images/logo.svg'

import { getSiretInformation, sendMagiclink } from '../../api'
import AnimationContainer from '../../components/AnimationContainer'

const CreationCompte = () => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const history = useHistory()

  const submitSiret = (values, { setSubmitting, setFieldError }) => {
    // validate SIRET
    getSiretInformation(values)
      .then(({ data }) => {
        setSubmitting(false)
        history.push('/authentification/creation-compte', { informationSiret: data })
      })
      .catch(({ response }) => {
        setFieldError('siret', response.data.message)
        setSubmitting(false)
      })
  }

  return (
    <Box p={['4', '8']}>
      <Heading size='lg' as='h2' mb={2}>
        Créez votre compte sur Matcha
      </Heading>
      <Text>Nous avons besoin du numéro de SIRET de votre centre de formation afin de vous identifier.</Text>
      <Box pt={12} mr={4}>
        <Formik
          validateOnMount
          initialValues={{ siret: undefined }}
          validationSchema={Yup.object().shape({
            siret: Yup.string()
              .matches(/^[0-9]+$/, 'Le siret est composé uniquement de chiffres')
              .min(14, 'le siret est sur 14 chiffres')
              .max(14, 'le siret est sur 14 chiffres')
              .required('champs obligatoire'),
          })}
          onSubmit={submitSiret}
        >
          {({ values, isValid, isSubmitting }) => {
            return (
              <>
                <Form>
                  <CustomInput
                    required={false}
                    name='siret'
                    label='SIRET'
                    type='text'
                    value={values.siret}
                    maxLength='14'
                  />
                  <Flex justifyContent='flex-end'>
                    <Button
                      mt={5}
                      type='submit'
                      size={buttonSize}
                      variant='form'
                      leftIcon={<SearchLine width={5} />}
                      isActive={isValid}
                      isDisabled={!isValid || isSubmitting}
                    >
                      Chercher
                    </Button>
                  </Flex>
                </Form>
              </>
            )
          }}
        </Formik>
      </Box>
    </Box>
  )
}

const ConnexionCompte = () => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const toast = useToast()

  const submitEmail = (values, { setFieldError, setSubmitting }) => {
    sendMagiclink(values)
      .then(() => {
        toast({
          title: 'Email valide.',
          description: "Un lien d'accès personnalisé vous a été envoyé par mail.",
          position: 'top-right',
          status: 'success',
          duration: 5000,
        })
        setTimeout(() => {
          setSubmitting(false)
        }, 15000)
      })
      .catch(() => {
        setFieldError('email', "L'adresse renseignée n'existe pas")
        setSubmitting(false)
      })
  }

  return (
    <Box bg='grey.150' p={['4', '8']} mb={['4', '0']}>
      <Heading size='lg' as='h2' mb={2}>
        Vous avez déjà un compte ?
      </Heading>
      <Text>Veuillez indiquer ci-dessous l’e-mail avec lequel vous avez créé votre compte.</Text>
      <Box pt={12} mr={4}>
        <Formik
          validateOnMount
          initialValues={{ email: undefined }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
          })}
          onSubmit={submitEmail}
        >
          {({ values, isValid, isSubmitting, dirty }) => {
            return (
              <Form autoComplete='off'>
                <CustomInput name='email' label='E-mail professionnel' type='text' value={values.email} />
                <Flex justifyContent='flex-end'>
                  <Button
                    mt={5}
                    type='submit'
                    size={buttonSize}
                    variant='form'
                    leftIcon={<ArrowRightLine width={5} />}
                    isActive={isValid}
                    isDisabled={!isValid || isSubmitting}
                  >
                    Je me connecte
                  </Button>
                </Flex>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </Box>
  )
}

export default () => {
  const history = useHistory()

  return (
    <AnimationContainer>
      <Container maxW='container.xl' p={['0', '5']} h='100vh'>
        <Flex direction='column' h='100vh' mb={['4', '0']}>
          <Flex justifyContent='space-between' alignItems='center' px={['2', '8']} pb={['4', '0']}>
            <Image display='flex' src={logo} alt='logo matcha' mr={5} />
            <Button
              display='flex'
              onClick={() => history.push('/')}
              fontWeight='normal'
              variant='link'
              color='bluefrance.500'
              rightIcon={<Close width={5} />}
            >
              fermer
            </Button>
          </Flex>

          <SimpleGrid columns={['1', '2']} gap={5} flex='1' alignItems='center'>
            <GridItem>
              <CreationCompte />
            </GridItem>
            <GridItem bg='grey.150'>
              <ConnexionCompte />
            </GridItem>
          </SimpleGrid>
        </Flex>
      </Container>
    </AnimationContainer>
  )
}
