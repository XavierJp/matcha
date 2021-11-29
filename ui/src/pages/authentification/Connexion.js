import { Flex, Button, Heading, Text, Box, Stack, useBreakpointValue, useToast } from '@chakra-ui/react'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { ArrowRightLine } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'

import { sendMagiclink } from '../../api'
import AnimationContainer from '../../components/AnimationContainer'
import AuthentificationLayout from './components/Authentification-layout'

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
      .catch(({ response }) => {
        setFieldError('email', response.data.message)
        setSubmitting(false)
      })
  }

  return (
    <Stack direction='column' spacing={7} bg='grey.150' p={['4', '8']} py={10} pr={12}>
      <Heading fontSize='32px' as='h2'>
        Vous avez déjà un compte ?
      </Heading>
      <Text fontSize='xl'>Veuillez indiquer ci-dessous l’e-mail avec lequel vous avez créé votre compte.</Text>
      <Box>
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
                <CustomInput
                  required={false}
                  name='email'
                  label='E-mail professionnel'
                  type='text'
                  value={values.email}
                  width='90%'
                />

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
              </Form>
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
          <Box bg='grey.150' maxW='50%'>
            <ConnexionCompte />
          </Box>
        </Flex>
      </AuthentificationLayout>
    </AnimationContainer>
  )
}
