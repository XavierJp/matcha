import { Heading, Text, Flex, useBreakpointValue, Button } from '@chakra-ui/react'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { ArrowRightLine, InfoCircle } from '../../../theme/components/icons'
import CustomInput from '../../formulaire/components/CustomInput'

export default ({ raison_sociale, uai, adresse, email }) => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const submitForm = (values, formikBag) => {
    // save info if not trusted from source
  }

  return (
    <>
      <Heading mb={5}>Information légales</Heading>
      <Flex alignItems='flex-start' alignItems='flex-start' mb={5}>
        <InfoCircle mr={2} mt={1} />
        <Text>Vérifiez que les informations pré-remplies sont correctes avant de continuer.</Text>
      </Flex>
      <Formik
        initialValues={{
          raison_sociale: raison_sociale ?? undefined,
          uai: uai ?? undefined,
          adresse: adresse ?? undefined,
          email: email ?? undefined,
        }}
        validationSchema={Yup.object().shape({
          raison_sociale: Yup.string().required('champs obligatoire').min(1),
          siret: Yup.string()
            .matches(/^[0-9]+$/, 'Le siret est composé uniquement de chiffres')
            .min(14, 'le siret est sur 14 chiffres')
            .max(14, 'le siret est sur 14 chiffres')
            .required('champs obligatoire'),
          adresse: Yup.string().required('champ obligatoire'),
          email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
        })}
        onSubmit={submitForm}
      >
        {({ values, isValid, isSubmitting }) => {
          return (
            <>
              <CustomInput
                required={false}
                name='raison_sociale'
                label='Raison sociale'
                type='text'
                value={values.raison_sociale}
              />
              <CustomInput required={false} name='uai' label='UAI' type='text' value={values.uai} />
              <CustomInput required={false} name='adresse' label='Adresse' type='text' value={values.adresse} />
              <CustomInput
                required={false}
                name='email'
                label='Email'
                type='email'
                value={values.email}
                info='Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Vérifiez qu’elle soit correct ou bien modifiez-le'
              />
              <Flex justifyContent='flex-end'>
                <Button
                  type='submit'
                  size={buttonSize}
                  variant='primary'
                  leftIcon={<ArrowRightLine width={5} />}
                  isActive={isValid}
                  disabled={!isValid || isSubmitting}
                >
                  Suivant
                </Button>
              </Flex>
            </>
          )
        }}
      </Formik>
    </>
  )
}
