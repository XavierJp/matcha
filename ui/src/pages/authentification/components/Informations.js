import { Heading, Text, Flex, useBreakpointValue, Button, Link as ChakraLink } from '@chakra-ui/react'
import { memo } from 'react'
import { Form, Formik } from 'formik'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { createPartenaire, createUser } from '../../../api'

import { ArrowRightLine, InfoCircle } from '../../../theme/components/icons'
import CustomInput from '../../formulaire/components/CustomInput'
import CustomSelect from '../../formulaire/components/CustomSelect'

const ContactField = memo(({ values }) => {
  let hasTrusties = Boolean(values.contacts.filter((c) => c.confirmé === true).length)

  if (values.contacts.length > 1 && hasTrusties) {
    return (
      <CustomSelect
        name='email'
        label='Email'
        type='email'
        placeholder='Selectionnez une adresse mail disponible'
        info={
          <>
            Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Si vous souhaitez ajouter, corriger ou
            modifier celles-ci,{' '}
            <ChakraLink href='mailto:contact@matcha.apprentissage.beta.gouv.fr' textDecoration='underline'>
              contactez l’équipe ici
            </ChakraLink>
          </>
        }
      >
        {values.contacts.map((c) => (
          <option key={c.email} value={c.email} disabled={!c.confirmé}>
            {c.email}
          </option>
        ))}
      </CustomSelect>
    )
  }

  if (values.contacts.length === 1) {
    return (
      <CustomInput
        required={false}
        name='email'
        label='Email'
        type='email'
        value={values.email}
        info='Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Vérifiez qu’elle soit correcte ou bien modifiez-la'
      />
    )
  }

  return (
    <CustomInput
      required={false}
      name='email'
      label='Email'
      type='email'
      value={values.email}
      info='Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Privilégiez votre adresse professionnelle'
    />
  )
})

export default ({ raison_sociale, uai, adresse, contacts, siret }) => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  let history = useHistory()

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    // save info if not trusted from source
    createPartenaire(values)
      .then(({ data }) => {
        history.push('/authentification/confirmation', { email: data.email })
        setSubmitting(false)
      })
      .catch((error) => {
        setFieldError('email', error.response.data.message)
        setSubmitting(false)
      })
  }

  return (
    <>
      <Heading mb={5}>Information légales</Heading>
      <Flex alignItems='flex-start' alignItems='flex-start' mb={5}>
        <InfoCircle mr={2} mt={1} />
        <Text>Vérifiez que les informations pré-remplies sont correctes avant de continuer.</Text>
      </Flex>
      <Formik
        validateOnMount={true}
        initialValues={{
          raison_sociale: raison_sociale ?? undefined,
          uai: uai ?? undefined,
          adresse: adresse ?? undefined,
          contacts: contacts ?? undefined,
          siret: siret,
          email: contacts.length === 1 ? contacts[0].email : undefined,
        }}
        validationSchema={Yup.object().shape({
          raison_sociale: Yup.string().required('champs obligatoire'),
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
        {(informationForm) => {
          return (
            <Form>
              <CustomInput
                required={false}
                isDisabled={true}
                name='raison_sociale'
                label='Raison sociale'
                type='text'
                value={informationForm.values.raison_sociale}
              />
              <CustomInput
                required={false}
                isDisabled={true}
                name='uai'
                label='UAI'
                type='text'
                value={informationForm.values.uai}
              />
              <CustomInput
                required={false}
                isDisabled={true}
                name='adresse'
                label='Adresse'
                type='text'
                value={informationForm.values.adresse}
              />
              <ContactField values={informationForm.values} />
              <Flex justifyContent='flex-end' alignItems='center'>
                <ChakraLink as={Link} size={buttonSize} variant='secondary' mr={5} to='/'>
                  Annuler
                </ChakraLink>
                <Button
                  type='submit'
                  size={buttonSize}
                  variant='primary'
                  leftIcon={<ArrowRightLine width={5} />}
                  isActive={informationForm.isValid}
                  isDisabled={!informationForm.isValid || informationForm.isSubmitting}
                >
                  Suivant
                </Button>
              </Flex>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
