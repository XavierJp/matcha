import { Button, Heading, Text, Box, useBreakpointValue, Divider, useBoolean, Link } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

import AuthentificationLayout from './components/Authentification-layout'
import CustomInput from '../formulaire/components/CustomInput'
import { ArrowRightLine } from '../../theme/components/icons'
import { validationCompte, sendMagiclink } from '../../api'
import { useHistory, useParams } from 'react-router'

const EmailValide = () => {
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
    <>
      <Box pt={['6w', '12w']}>
        <Heading fontSize={['32px', '40px']} as='h1'>
          Mail vérifié
        </Heading>
        <Text fontSize={['16px', '22px']}>
          Votre email eao@artisanat-aquitaine.fr a bien été validé, vous pouvez maintenant vous connecter.
        </Text>
      </Box>
      <Divider my={6} w='20%' />
      <Box>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
          })}
          onSubmit={submitEmail}
        >
          {({ values, isValid, isSubmitting }) => {
            return (
              <Form>
                <CustomInput
                  required={false}
                  name='email'
                  label='Email professionnel'
                  type='email'
                  value={values.email}
                  mb={5}
                  width={['90%', '35%']}
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
              </Form>
            )
          }}
        </Formik>
      </Box>
    </>
  )
}

const EmailInvalide = () => (
  <>
    <Box pt={['6w', '12w']}>
      <Heading fontSize={['32px', '40px']} as='h1'>
        Mail invalide
      </Heading>
      <Text fontSize={['16px', '22px']}>
        La validation de votre email à échoué. Merci de{' '}
        <Link pl={2} href='mailto:matcha@apprentissage.beta.gouv.fr' textDecoration='underline'>
          Contacter l'équipe de Matcha
        </Link>
      </Text>
    </Box>
  </>
)

export default (props) => {
  const [isValid, setIsValid] = useBoolean()
  const { id } = useParams()

  useEffect(() => {
    // get user from params coming from email link
    validationCompte({ id })
      .then(() => setIsValid.on())
      .catch(() => setIsValid.off())
  }, [id])

  return <AuthentificationLayout>{isValid ? <EmailValide /> : <EmailInvalide />}</AuthentificationLayout>
}
