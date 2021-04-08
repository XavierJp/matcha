import * as Yup from 'yup'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { Formik, Form, useField } from 'formik'
import {
  Button,
  useDisclosure,
  Box,
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Flex,
  Text,
  Stack,
} from '@chakra-ui/react'

import { ChatBubble, Layout } from '../../components'
import AjouterVoeux from './AjouterVoeux'
import ListeVoeux from './ListeVoeux'
import Autocomplete from './AdresseAutocomplete'

const CustomInput = (props) => {
  const [field, meta] = useField(props)
  return (
    <Box pb='5'>
      <FormControl isInvalid={meta.error && meta.touched} isRequired>
        <FormLabel>{props.label}</FormLabel>
        <Input {...field} {...props} />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    </Box>
  )
}

const Formulaire = (props) => {
  const [initialFormState, setInitialFormState] = useState({})
  const [currentOffer, setCurrentOffer] = useState({})
  const popupState = useDisclosure()
  const { params } = props.match
  const history = useHistory()

  const { isLoading } = useQuery(
    ['formulaire', { id: params.id }],
    ({ queryKey }) => Axios.get(`api/formulaire/${queryKey[1].id}`),
    {
      onSuccess: ({ data }) => {
        setInitialFormState(data)
      },
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    history.listen((_, action) => {
      if (action === 'POP') {
        window.location.reload()
      }
    })
  }, [initialFormState])

  /**
   *
   * user params comes from the URL (OPCO ATLAS)
   *
    useEffect(() => {
      const params = new URLSearchParams(window.location.search)
      let user = {}
      for (let i of params) {
        let [key, value] = i
        user[key] = value
      }
      setInitialFormState(result)
    }, [])
  */

  const editOffer = (item, index) => {
    setCurrentOffer({ ...item, index })
    popupState.onOpen()
  }

  const addOffer = () => {
    setCurrentOffer({})
    popupState.onOpen()
  }

  const saveOffer = (values) => {
    const copy = { ...initialFormState }

    if (values.index !== undefined) {
      copy.offres[values.index] = values
      setInitialFormState(copy)
      return
    }

    if (copy.offres === undefined) {
      copy.offres = []
    }
    copy.offres.push(values)
    setInitialFormState(copy)
  }

  const removeOffer = (index) => {
    const copy = { ...initialFormState }
    copy.offres.splice(index, 1)
    setInitialFormState(copy)
  }

  const submitFormulaire = async (values, { setSubmitting }) => {
    const payload = {
      ...values,
      offres: initialFormState.offres ?? [],
    }
    const res = await Axios.post(`api/formulaire/${params.id}`, payload)
    setSubmitting(false)

    if (res.status === 200) {
      history.push('/merci')
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <Text>Chargement en cours...</Text>
      </Layout>
    )
  }

  return (
    <Layout>
      <AjouterVoeux {...popupState} {...currentOffer} handleSave={saveOffer} />
      <Box pb='3'>
        <Formik
          enableReinitialize={true}
          initialValues={{
            raison_sociale: initialFormState?.raison_sociale ?? '',
            siret: initialFormState?.siret ?? '',
            adresse: initialFormState?.adresse ?? '',
            geo_coordonnees: initialFormState?.geo_coordonnees ?? '',
            nom: initialFormState?.nom ?? '',
            prenom: initialFormState?.prenom ?? '',
            telephone: initialFormState?.telephone ?? '',
            email: initialFormState?.email ?? '',
            offres: initialFormState?.offres,
          }}
          validationSchema={Yup.object().shape({
            raison_sociale: Yup.string().required('champs obligatoire').min(1),
            siret: Yup.string()
              .matches(/^[0-9]+$/, 'Le siret est composé uniquement de chiffre')
              .required('champs obligatoire')
              .min(14, 'le siret est sur 14 chiffres'),
            adresse: Yup.string().required('champ obligatoire'),
            nom: Yup.string().required('champ obligatoire'),
            prenom: Yup.string().required('champ obligatoire'),
            telephone: Yup.string().required('champ obligatoire'),
            email: Yup.string().email('Insérer un email valide').required('champ obligatoire'),
          })}
          onSubmit={submitFormulaire}
        >
          {({ values, isValid, dirty, isSubmitting, setFieldValue }) => {
            const hasOffer = values.offres?.length > 0

            return (
              <Form autoComplete='off'>
                <Box my='3'>
                  <Text as='strong' fontSize='md' fontFamily='Inter-bold'>
                    Renseignements sur votre entreprise
                  </Text>
                </Box>

                <CustomInput
                  name='raison_sociale'
                  label="Nom de l'engeigne"
                  type='text'
                  value={values.raison_sociale}
                />
                <CustomInput name='siret' label='SIRET' type='text' value={values.siret} maxLength='14' />

                <FormControl isRequired>
                  <FormLabel>Adresse</FormLabel>
                  <Autocomplete
                    placeholder='Tapez votre adresse complète'
                    handleValues={(value) => {
                      setFieldValue('adresse', value.name)
                      setFieldValue('geo_coordonnees', value.geo_coordonnees)
                    }}
                    context={values.adresse}
                  />
                </FormControl>

                <Box mb='3'>
                  <Text as='strong' fontSize='md' fontFamily='Inter-bold'>
                    Information sur le contact privilégié
                  </Text>
                </Box>

                <CustomInput name='nom' label='Nom' type='text' value={values.nom} />
                <CustomInput name='prenom' label='Prénom' type='test' value={values.prenom} />
                <CustomInput
                  name='telephone'
                  label='Téléphone'
                  type='tel'
                  pattern='[0-9]{10}'
                  value={values.telephone}
                />
                <CustomInput name='email' label='Email' type='email' value={values.email} />

                <Box bg='lightGrey' py='5' px='5' width='100%' borderRadius='2'>
                  <Box pb='6'>
                    <Text as='strong' fontSize='md' fontFamily='Inter-bold'>
                      Votre besoin de recrutement
                    </Text>
                  </Box>
                  <ChatBubble margin='0'>
                    Recherchez le domain d'activité se rapprochant le plus de votre offre d'apprentissage. Plusieurs
                    offres possibes
                  </ChatBubble>

                  <Box mt={4} mb={8}>
                    <ListeVoeux data={initialFormState?.offres} removeOffer={removeOffer} editOffer={editOffer} />
                  </Box>

                  <Stack align='center' spacing='2'>
                    <Button
                      leftIcon={<IoIosAddCircleOutline />}
                      rounded='50px'
                      onClick={addOffer}
                      bg='grey'
                      color='green'
                      size='lg'
                    >
                      Ajouter une offre d'apprentissage
                    </Button>
                    {!hasOffer && (
                      <Box>
                        <Text fontSize='sm'>*minimum une offre </Text>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Flex justify='center' align='center' my='50'>
                  <Button
                    type='submit'
                    rounded='10px'
                    color='red'
                    size='lg'
                    isActive={(isValid && (dirty || hasOffer)) || isSubmitting}
                    disabled={!(isValid && (dirty || hasOffer)) || isSubmitting}
                  >
                    Enregistrer mes offres
                  </Button>
                </Flex>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </Layout>
  )
}

export default Formulaire
