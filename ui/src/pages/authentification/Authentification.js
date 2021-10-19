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
  useBoolean,
} from '@chakra-ui/react'
import { useState } from 'react'

import { useHistory } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { Close, SearchLine, ArrowRightLine } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'
import logo from '../../assets/images/logo.svg'
import Informations from './components/Informations'
import { getSiretInformation, sendMagiclink } from '../../api'
import AnimationContainer from '../../components/AnimationContainer'

const CreationCompte = ({ submitSiret, validSIRET, siretInformation }) => {
  const buttonSize = useBreakpointValue(['sm', 'md'])

  return (
    <Box p={['4', '8']}>
      <Heading size='lg' as='h2' mb={2}>
        Créez votre compte sur Matcha
      </Heading>
      <Text>Nous avons besoin du numéro de SIRET de votre centre de formation afin de vous identifier.</Text>
      <Box pt={12} mr={4}>
        <Formik
          initialValues={{ siret: '19693654600015' }}
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
                    isDisabled={validSIRET}
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
                      variant='greyed'
                      leftIcon={<SearchLine width={5} />}
                      isActive={isValid}
                      disabled={!isValid || isSubmitting}
                    >
                      Chercher
                    </Button>
                  </Flex>
                </Form>
                {validSIRET && siretInformation ? (
                  <AnimationContainer>
                    <Informations {...siretInformation} />
                  </AnimationContainer>
                ) : null}
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
  const history = useHistory()

  const submitEmail = (values, { setFieldError, setSubmitting }) => {
    sendMagiclink(values)
      .then(() => {
        history.push('/authentification/confirmation', { email: values.email })
        setSubmitting(false)
      })
      .catch(() => {
        setFieldError('email', "L'adresse renseigné n'existe pas")
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
          enableReinitialize
          initialValues={{ email: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
          })}
          onSubmit={submitEmail}
        >
          {({ values, isValid, isSubmitting, dirty }) => {
            return (
              <Form autoComplete='off'>
                <CustomInput name='email' label='E-mail professionnel' type='text' value={values.email} />
                <Button
                  mt={5}
                  type='submit'
                  size={buttonSize}
                  variant='primary'
                  leftIcon={<ArrowRightLine width={5} />}
                  isActive={isValid}
                  disabled={(!isValid && dirty) || isSubmitting}
                >
                  Je me connecte
                </Button>
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
  const [validSIRET, setValidSIRET] = useBoolean()
  const [siretInformation, setSiretInformation] = useState({})

  const submitSiret = (values, { setSubmitting, setFieldError }) => {
    // validate SIRET
    getSiretInformation(values)
      .then(({ data }) => {
        setSiretInformation(data)
        setValidSIRET.on()
        setSubmitting(false)
      })
      .catch(({ response }) => {
        setFieldError('siret', response.data.message)
        setSubmitting(false)
      })
  }

  return (
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
            <CreationCompte submitSiret={submitSiret} validSIRET={validSIRET} siretInformation={siretInformation} />
          </GridItem>
          {!validSIRET && (
            <GridItem bg='grey.150'>
              <ConnexionCompte />
            </GridItem>
          )}
        </SimpleGrid>
      </Flex>
    </Container>
  )
}
