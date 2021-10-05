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

import { useHistory } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { Close, SearchLine, ArrowRightLine } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'
import logo from '../../assets/images/logo.svg'
import Informations from './components/Informations'

const CreationCompte = () => {
  const [validSIRET, setValidSIRET] = useBoolean(false)
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const submitSiret = (values, formikBag) => {
    // validate SIRET
  }

  return (
    <Box p={['2', '8']}>
      <Heading size='lg' as='h2' mb={2}>
        Créez votre compte sur Matcha
      </Heading>
      <Text>Nous avons besoin du numéro de SIRET de votre centre de formation afin de vous identifier.</Text>
      <Box pt={12} mr={4}>
        <Formik
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
                <CustomInput
                  required={false}
                  name='siret'
                  label='SIRET'
                  type='text'
                  value={values.siret}
                  maxLength='14'
                  mb={5}
                />
                {validSIRET ? (
                  <Informations />
                ) : (
                  <Button
                    type='submit'
                    size={buttonSize}
                    variant='greyed'
                    leftIcon={<SearchLine width={5} />}
                    isActive={isValid}
                    disabled={!isValid || isSubmitting}
                  >
                    Chercher
                  </Button>
                )}
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

  const submitEmail = () => {}

  return (
    <Box bg='grey.150' p={['2', '8']} mb={['4', '0']}>
      <Heading size='lg' as='h2' mb={2}>
        Vous avez déjà un compte ?
      </Heading>
      <Text>Veuillez indiquer ci-dessous l’e-mail avec lequel vous avez créé votre compte.</Text>
      <Box pt={12} mr={4}>
        <Formik
          initialValues={{ email: undefined }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
          })}
          onSubmit={submitEmail}
        >
          {({ values, isValid, isSubmitting }) => {
            return (
              <>
                <CustomInput
                  required={false}
                  name='siret'
                  label='E-mail professionnel'
                  type='text'
                  value={values.email}
                  maxLength='14'
                  mb={5}
                />
                <Button
                  type='submit'
                  size={buttonSize}
                  variant='greyed'
                  leftIcon={<ArrowRightLine width={5} />}
                  isActive={isValid}
                  disabled={!isValid || isSubmitting}
                >
                  Je me connecte
                </Button>
              </>
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
  )
}
