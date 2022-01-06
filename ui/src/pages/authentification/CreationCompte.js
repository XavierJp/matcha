import { Flex, Button, Heading, Text, Box, Stack, useBreakpointValue } from '@chakra-ui/react'

import { useNavigate, useLocation } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { SearchLine } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'

import { getCfaInformation, getEntrepriseInformation } from '../../api'
import AnimationContainer from '../../components/AnimationContainer'
import AuthentificationLayout from './components/Authentification-layout'

const CreationCompte = () => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const navigate = useNavigate()
  const location = useLocation()

  const { type } = location.state

  const submitSiret = ({ siret }, { setSubmitting, setFieldError }) => {
    // validate SIRET
    if (type === 'ENTREPRISE') {
      getEntrepriseInformation(siret)
        .then(({ data }) => {
          setSubmitting(false)
          navigate('/creation-compte/detail', { informationSiret: data, type })
        })
        .catch(({ response }) => {
          setFieldError('siret', response.data.message)
          setSubmitting(false)
        })
    } else {
      getCfaInformation(siret)
        .then(({ data }) => {
          setSubmitting(false)
          navigate('/creation-compte/detail', { informationSiret: data, type })
        })
        .catch(({ response }) => {
          setFieldError('siret', response.data.message)
          setSubmitting(false)
        })
    }
  }

  return (
    <Stack direction='column' spacing={7} bg='grey.150' p={['4', '8']} py={10} pr={12}>
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
                    width='90%'
                  />
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
                </Form>
              </>
            )
          }}
        </Formik>
      </Box>
    </Stack>
  )
}

export default () => {
  return (
    <AnimationContainer>
      <AuthentificationLayout>
        <Flex align='center' justify='center' flex='1'>
          <CreationCompte />
        </Flex>
      </AuthentificationLayout>
    </AnimationContainer>
  )
}
