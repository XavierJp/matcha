import { Box, Button, Flex, Heading, Link, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
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
    <Stack direction='column' align='stretch' spacing={7} p={['4', '8']} py={[5, 10]} pr={[6, 12]} flex='1'>
      <Heading size='lg' as='h2'>
        {type === 'ENTREPRISE' ? 'Retrouvez votre entreprise' : 'Créez votre compte sur Matcha'}
      </Heading>
      <Text fontSize='xl'>
        Nous avons besoin du numéro SIRET de votre {type === 'ENTREPRISE' ? 'entreprise' : 'organisme de formation'}{' '}
        afin de vous identifier.
      </Text>
      <Box mt={[1, 5]}>
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
      </Box>
    </Stack>
  )
}

const InformationSiret = ({ type }) => {
  return (
    <Box border='1px solid #000091' p={['4', '8']} py={[5, 10]} pr={[6, 12]} flex='1'>
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
        <Stack direction={['column', 'row']} spacing={[10, 5]} align='center' mt={[5, 10]} mr={[0, 8]} p={[2, 0]}>
          <CreationCompte {...props} />
          <InformationSiret {...props} />
        </Stack>
        {/* </Flex> */}
      </AuthentificationLayout>
    </AnimationContainer>
  )
}
