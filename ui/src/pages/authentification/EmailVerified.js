import { Button, Heading, Text, Box, useBreakpointValue, Divider } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AuthentificationLayout from './components/Authentification-layout'
import CustomInput from '../formulaire/components/CustomInput'
import { ArrowRightLine } from '../../theme/components/icons'

export default (props) => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  useEffect(() => {
    // get user from params coming from email link
  })

  const submitEmail = ({ email }, formikBag) => {
    // send magic link
  }

  return (
    <AuthentificationLayout>
      <Box pt={['6w', '12w']}>
        <Heading as='h1'>Mail vérifié</Heading>
        <Text fontSize='xl'>
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
              <>
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
              </>
            )
          }}
        </Formik>
      </Box>
    </AuthentificationLayout>
  )
}
