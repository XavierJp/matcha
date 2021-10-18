import { Heading, Text, Flex, useBreakpointValue, Button, Link as ChakraLink } from '@chakra-ui/react'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import { ArrowRightLine, InfoCircle } from '../../../theme/components/icons'
import CustomInput from '../../formulaire/components/CustomInput'
import CustomSelect from '../../formulaire/components/CustomSelect'

const ContactField = ({ values }) => {
  if (values.contacts.length > 1) {
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
            <Link href='mailto:contact@matcha.apprentissage.beta.gouv.fr' textDecoration='underline'>
              contactez l’équipe ici
            </Link>
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
        info='Il s’agit de l’adresse qui vous permettra de vous connecter à Matcha. Vérifiez qu’elle soit correct ou bien modifiez-le'
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
}

export default ({ raison_sociale, uai, adresse, contacts, siret }) => {
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
        {({ values, isValid, isSubmitting }) => {
          return (
            <>
              <CustomInput
                required={false}
                isDisabled={true}
                name='raison_sociale'
                label='Raison sociale'
                type='text'
                value={values.raison_sociale}
              />
              <CustomInput required={false} isDisabled={true} name='uai' label='UAI' type='text' value={values.uai} />
              <CustomInput
                required={false}
                isDisabled={true}
                name='adresse'
                label='Adresse'
                type='text'
                value={values.adresse}
              />
              <ContactField values={values} />
              <Flex justifyContent='flex-end' alignItems='center'>
                <ChakraLink as={Link} size={buttonSize} variant='secondary' mr={5} to='/'>
                  Annuler
                </ChakraLink>
                <Button
                  type='submit'
                  size={buttonSize}
                  variant='primary'
                  leftIcon={<ArrowRightLine width={5} />}
                  isActive={isValid}
                  isDisabled={!isValid || isSubmitting}
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
