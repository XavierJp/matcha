import { Flex, Button, Heading, Text, Box, Stack, useBreakpointValue, Link } from '@chakra-ui/react'

import { useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { SearchLine, InfoCircle } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'

import { getCfaInformation, getEntrepriseInformation } from '../../api'
import AnimationContainer from '../../components/AnimationContainer'
import AuthentificationLayout from './components/Authentification-layout'

const CreationCompte = ({ type }) => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const navigate = useNavigate()

  const submitSiret = ({ siret }, { setSubmitting, setFieldError }) => {
    // validate SIRET
    if (type === 'ENTREPRISE') {
      getEntrepriseInformation(siret)
        .then(({ data }) => {
          setSubmitting(false)
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
    <Stack direction='column' spacing={7} p={['4', '8']} py={10} pr={12}>
      <Heading size='lg' as='h2'>
        {type === 'ENTREPRISE' ? 'Retrouvez votre entreprise' : 'Créez votre compte sur Matcha'}
      </Heading>
      <Text fontSize='xl'>Nous avons besoin du numéro SIRET afin de vous identifier.</Text>
      <Box mr={4}>
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
                  <Flex justify='flex-end'>
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
    </Stack>
  )
}

const InformationSiret = ({ type }) => {
  return (
    <Box border='1px solid #000091' px={6} py={5} flex='1'>
      <Heading fontSize='24px' mb={3}>
        Où trouver votre SIRET ?
      </Heading>
      <Flex alignItems='flex-start' alignItems='flex-start'>
        <InfoCircle mr={2} mt={1} />
        {type === 'ENTREPRISE' ? (
          <Text>
            Le numéro d’identification de votre entreprise peut être trouvé sur
            <Link href='https://annuaire-entreprises.data.gouv.fr/' variant='classic' isExternal>
              l’annuaire des entreprises
            </Link>
            ou bien sur les registres de votre entreprises
          </Text>
        ) : (
          <Text>
            Le numéro d’identification de votre entreprise peut être trouvé sur le site
            <Link
              href='https://catalogue.apprentissage.beta.gouv.fr/recherche/etablissements'
              variant='classic'
              isExternal
            >
              Le catalogue des offres de formations en apprentissage
            </Link>
            ou bien sur les registres de votre entreprise.
          </Text>
        )}
      </Flex>
    </Box>
  )
}

export default (props) => {
  return (
    <AnimationContainer>
      <AuthentificationLayout>
        {/* <Flex align='center'> */}
        <Stack direction={['column', 'row']} spacing='27px' align='center' mt={10}>
          <CreationCompte {...props} />
          <InformationSiret {...props} />
        </Stack>
        {/* </Flex> */}
      </AuthentificationLayout>
    </AnimationContainer>
  )
}
