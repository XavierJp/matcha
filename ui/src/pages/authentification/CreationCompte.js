import { Box, Button, Flex, Grid, GridItem, Heading, Link, Text, useBreakpointValue } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { getCfaInformation, getEntrepriseInformation } from '../../api'
import AnimationContainer from '../../components/AnimationContainer'
import { InfoCircle, SearchLine } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'
import AuthentificationLayout from './components/Authentification-layout'

const CreationCompte = ({ type }) => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const navigate = useNavigate()

  const submitSiret = ({ siret }, { setSubmitting, setFieldError }) => {
    // validate SIRET
    if (type === 'ENTREPRISE') {
      getEntrepriseInformation(siret)
        .then(({ data }) => {
          setSubmitting(true)
          navigate('/creation/detail', { state: { informationSiret: data, type } })
        })
        .catch(({ response }) => {
          setFieldError('siret', response.data.message)
          setSubmitting(false)
        })
    } else {
      getCfaInformation(siret)
        .then(({ data }) => {
          setSubmitting(false)
          navigate('/creation/detail', { state: { informationSiret: data, type } })
        })
        .catch(({ response }) => {
          setFieldError('siret', response.data.message)
          setSubmitting(false)
        })
    }
  }

  return (
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
              <Flex justify='flex-end' mt={5}>
                <Button
                  type='submit'
                  size={buttonSize}
                  variant='form'
                  leftIcon={<SearchLine width={5} />}
                  isActive={isValid}
                  isDisabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                >
                  Chercher
                </Button>
              </Flex>
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

const InformationSiret = ({ type }) => {
  return (
    <Box border='1px solid #000091' p={['4', '8']}>
      <Heading fontSize='24px' mb={3}>
        Où trouver votre SIRET ?
      </Heading>
      <Flex alignItems='flex-start' alignItems='flex-start'>
        <InfoCircle mr={2} mt={1} />
        {type === 'ENTREPRISE' ? (
          <Text textAlign='justify'>
            Le numéro d’identification de votre entreprise peut être trouvé sur
            <Link href='https://annuaire-entreprises.data.gouv.fr/' variant='classic' isExternal>
              l’annuaire des entreprises
            </Link>
            ou bien sur les registres de votre entreprise.
          </Text>
        ) : (
          <Text>
            Le numéro d’identification de votre organisme peut être trouvé sur le site
            <Link
              href='https://catalogue.apprentissage.beta.gouv.fr/recherche/etablissements'
              variant='classic'
              isExternal
            >
              Le catalogue des offres de formations en apprentissage
            </Link>
            ou bien sur les registres de votre organisme de formation.
          </Text>
        )}
      </Flex>
    </Box>
  )
}

export default ({ type }) => {
  return (
    <AnimationContainer>
      <AuthentificationLayout>
        <Grid templateRows={['1fr', '.5fr 2fr']} templateColumns={['1fr', '4fr 5fr']} gap={4}>
          <GridItem px={[4, 8]} pt={[6, 12]}>
            <Heading fontSize='32px'>
              {type === 'ENTREPRISE' ? 'Retrouvez votre entreprise' : 'Créez votre compte sur Matcha'}
            </Heading>
            <Text fontSize='20px' pt='32px'>
              Nous avons besoin du numéro SIRET de votre{' '}
              {type === 'ENTREPRISE' ? 'entreprise' : 'organisme de formation'} afin de vous identifier.
            </Text>
          </GridItem>
          <GridItem rowStart={2} p={[4, 8]}>
            <CreationCompte type={type} />
          </GridItem>
          <GridItem rowStart={['auto', 2]} pt={[4, 8]} px={[4, 'auto']}>
            <InformationSiret type={type} />
          </GridItem>
        </Grid>
      </AuthentificationLayout>
    </AnimationContainer>
  )
}
