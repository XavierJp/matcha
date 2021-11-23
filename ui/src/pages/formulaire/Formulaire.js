import { useParams, useHistory } from 'react-router-dom'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { Formik, Form, useField, Field } from 'formik'
import { AiOutlineEdit } from 'react-icons/ai'
import { useState, useEffect, useContext, memo } from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import {
  Button,
  Box,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Flex,
  Grid,
  GridItem,
  Text,
  useDisclosure,
  useBoolean,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Spacer,
  useToast,
  useBreakpointValue,
  Image,
  Center,
  Link as ChakraLink,
  AlertIcon,
  Alert,
  Input,
} from '@chakra-ui/react'

import { getFormulaire, postFormulaire, postOffre, putFormulaire, putOffre, getEntrepriseInformation } from '../../api'
import { Layout, AnimationContainer } from '../../components'
import { ArrowDropRightLine, SearchLine } from '../../theme/components/icons'
import addOfferImage from '../../assets/images/add-offer.svg'

import ConfirmationSuppression from './components/ConfirmationSuppression'
import FormulaireLectureSeul from './components/FormulaireLectureSeul'
import AjouterVoeux from './components/AjouterVoeux'
import CustomInput from './components/CustomInput'
import ListeVoeux from './components/ListeVoeux'

import { LogoContext } from '../../contextLogo'
import useAuth from '../../common/hooks/useAuth'

const SiretDetails = ({ raison_sociale, domaine, adresse }) => {
  console.log(raison_sociale, domaine, adresse)
  return (
    <>
      <CustomInput label='Raison Sociale' value={raison_sociale} name='raison_sociale' isDisabled required={false} />
      <CustomInput label="Domaine d'activité" value={domaine} name='domaine' isDisabled required={false} />
      <CustomInput label='Adresse' value={adresse} name='adresse' isDisabled required={false} />
    </>
  )
}

const RechercheSiret = memo(({ submitSiret, validSIRET, siretInformation }) => {
  const buttonSize = useBreakpointValue(['sm', 'md'])

  return (
    <Formik
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
      {(siretForm) => {
        return (
          <>
            <Form>
              <CustomInput
                required={false}
                isDisabled={validSIRET}
                name='siret'
                label='SIRET'
                type='text'
                value={siretForm.values.siret}
                maxLength='14'
              />
              {!validSIRET && (
                <Flex justifyContent='flex-end'>
                  <Button
                    type='submit'
                    mt={5}
                    onClick={() => siretForm.submitForm()}
                    size={buttonSize}
                    variant='greyed'
                    leftIcon={<SearchLine width={5} />}
                    isActive={siretForm.isValid}
                    disabled={!siretForm.isValid || siretForm.isSubmitting}
                  >
                    Chercher
                  </Button>
                </Flex>
              )}
            </Form>
            {validSIRET && siretInformation ? (
              <AnimationContainer>
                <SiretDetails {...siretInformation} />
              </AnimationContainer>
            ) : null}
          </>
        )
      }}
    </Formik>
  )
})

export default (props) => {
  const [formState, setFormState] = useState({})
  const [offersList, setOffersList] = useState([])
  const [currentOffer, setCurrentOffer] = useState({})
  const [loading, setLoading] = useBoolean(true)
  const [error, setError] = useBoolean()
  const [readOnlyMode, setReadOnlyMode] = useBoolean()
  const [validSIRET, setValidSIRET] = useBoolean()
  const [siretInformation, setSiretInformation] = useState({})
  const ajouterVoeuxPopup = useDisclosure()
  const confirmationSuppression = useDisclosure()
  const { id_form, origine } = useParams()
  const toast = useToast()
  const history = useHistory()
  const { setOrganisation } = useContext(LogoContext)
  const [auth] = useAuth()

  const hasActiveOffers = offersList.filter((x) => x.statut === 'Active')

  const buttonSize = useBreakpointValue(['sm', 'md'])

  useEffect(() => {
    if (props?.byId) {
      getFormulaire(id_form)
        .then((result) => {
          setFormState(result.data)
          setOrganisation(result.data.origine)
          setOffersList(result.data.offres)
        })
        .catch(() => {
          setError.toggle(true)
        })
        .finally(() => {
          setLoading.toggle(false)
          setReadOnlyMode.toggle(true)
        })
    } else {
      const params = new URLSearchParams(window.location.search)
      let form = {}
      form.origine = origine ? origine.toLowerCase().replace(/ /g, '-') : null

      for (let i of params) {
        let [key, value] = i
        form[key] = value
      }

      form.adresse = undefined
      setFormState(form)
      setLoading.toggle(false)
    }
  }, [])

  const editOffer = (offer) => {
    setCurrentOffer(offer)
    ajouterVoeuxPopup.onOpen()
  }

  const addOffer = () => {
    setCurrentOffer({})
    ajouterVoeuxPopup.onOpen()
  }

  const saveOffer = (values) => {
    if (currentOffer._id) {
      // update
      putOffre(currentOffer._id, values).then((result) => setOffersList(result.data.offres))
      toast({
        title: 'Offre mise à jour avec succès !',
        position: 'top-right',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } else {
      // create
      postOffre(formState.id_form, values).then((result) => setOffersList(result.data.offres))
      toast({
        title: 'Offre enregistré avec succès !',
        position: 'top-right',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const extendOffer = (idOffre, values) => {
    putOffre(idOffre, values).then((result) => setOffersList(result.data.offres))
    toast({
      title: "Offre prolongé d'un mois",
      position: 'top-right',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const removeOffer = (offer) => {
    setCurrentOffer(offer)
    confirmationSuppression.onOpen()
  }

  const submitSiret = ({ siret }, { setSubmitting, setFieldError, setFieldValue }) => {
    // validate SIRET
    getEntrepriseInformation(siret)
      .then(({ data }) => {
        console.log(data)
        setSiretInformation(data)
        setFieldValue('adresse', data.adresse)
        setValidSIRET.on()
        // setSubmitting(false)
      })
      .catch(({ response }) => {
        setFieldError('siret', response.data.message)
        setSubmitting(false)
      })
  }

  const submitFormulaire = (values, { setSubmitting }) => {
    if (formState.id_form) {
      // update form
      putFormulaire(id_form, values).then((result) => {
        setFormState(result.data)
        toast({
          title: 'Enregistré avec succès',
          position: 'top-right',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        setSubmitting(false)
        setReadOnlyMode.toggle(true)
      })
    } else {
      // create form
      postFormulaire(values).then((result) => {
        setFormState(result.data)
        // enable description for AKTO (temporary)
        setOrganisation(result.data.origine)
        history.push(`/formulaire/${result.data.id_form}`)
        toast({
          title: 'Formulaire créé !',
          description: "Un mail d'accès vous a été envoyé",
          position: 'top-right',
          status: 'success',
          duration: 4000,
        })
        setSubmitting(false)
        setReadOnlyMode.toggle(true)
        ajouterVoeuxPopup.onOpen()
      })
    }
  }

  if (loading) {
    return (
      <Layout background='beige'>
        <Center p={5}>
          <Text>Chargement en cours...</Text>
        </Center>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout background='beige'>
        <Center p={5}>
          <Box>
            <Text align='center'>Une erreur est survenue lors du chargement du formulaire.</Text>
            <Text align='center' pt={3}>
              Merci de prendre contact directement avec un administrateur en cliquant sur le lien suivant :&nbsp;
              <ChakraLink
                href={`mailto:matcha@apprentissage.beta.gouv.fr?subject=Problème d'accès au formulaire — ${id_form}`}
                target='_blank'
                variant='unstyled'
              >
                contact
              </ChakraLink>
            </Text>
          </Box>
        </Center>
      </Layout>
    )
  }

  return (
    <>
      <AnimationContainer>
        <Layout background='beige' widget={props?.widget ?? false}>
          <AjouterVoeux {...ajouterVoeuxPopup} {...currentOffer} handleSave={saveOffer} />
          <ConfirmationSuppression
            {...confirmationSuppression}
            currentOffer={currentOffer}
            setOffersList={setOffersList}
          />
          <Container maxW='container.xl' pb={16}>
            {!props.widget && (
              <Box pt={3}>
                <Breadcrumb separator={<ArrowDropRightLine color='grey.600' />} textStyle='xs'>
                  {auth.sub !== 'anonymous' ? (
                    <Breadcrumb separator={<ArrowDropRightLine color='grey.600' />} textStyle='xs'>
                      <BreadcrumbItem>
                        <BreadcrumbLink textDecoration='underline' as={Link} to='/admin' textStyle='xs'>
                          Administration des offres
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbItem>
                        {formState._id ? (
                          <BreadcrumbLink textStyle='xs'>{formState.raison_sociale}</BreadcrumbLink>
                        ) : (
                          <BreadcrumbLink textStyle='xs'>Nouvelle entreprise</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Breadcrumb>
                  ) : (
                    <Breadcrumb separator={<ArrowDropRightLine color='grey.600' />} textStyle='xs'>
                      <BreadcrumbItem>
                        <BreadcrumbLink textDecoration='underline' as={Link} to='/' textStyle='xs'>
                          Accueil
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href='#' textStyle='xs'>
                          {formState._id ? 'Consulter vos offres en cours' : "Nouveau dépot d'offre"}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  )}
                </Breadcrumb>
              </Box>
            )}

            {readOnlyMode ? (
              <FormulaireLectureSeul formState={formState} buttonSize={buttonSize} setEditionMode={setReadOnlyMode} />
            ) : (
              <Formik
                validateOnMount={true}
                enableReinitialize={true}
                initialValues={{
                  mandataire: formState?.mandataire ?? false,
                  raison_sociale: formState?.raison_sociale ?? '',
                  siret: formState?.siret ? formState?.siret.replace(/ /g, '') : '',
                  adresse: formState?.adresse ?? '',
                  geo_coordonnees: formState?.geo_coordonnees ?? '',
                  nom: formState?.nom ?? '',
                  prenom: formState?.prenom ?? '',
                  telephone: formState?.telephone ? formState?.telephone.replace(/ /g, '') : '',
                  email: formState?.email ?? '',
                  origine: formState?.origine ?? '',
                }}
                validationSchema={Yup.object().shape({
                  raison_sociale: Yup.string().required('champs obligatoire').min(1),
                  siret: Yup.string()
                    .matches(/^[0-9]+$/, 'Le siret est composé uniquement de chiffres')
                    .min(14, 'le siret est sur 14 chiffres')
                    .max(14, 'le siret est sur 14 chiffres')
                    .required('champs obligatoire'),
                  adresse: Yup.string().required('champ obligatoire'),
                  nom: Yup.string().required('champ obligatoire'),
                  prenom: Yup.string().required('champ obligatoire'),
                  telephone: Yup.string()
                    .matches(/^[0-9]+$/, 'Le téléphone est composé uniquement de chiffres')
                    .min(10, 'le téléphone est sur 10 chiffres')
                    .max(10, 'le téléphone est sur 10 chiffres')
                    .required('champ obligatoire'),
                  email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
                })}
                onSubmit={submitFormulaire}
              >
                {({ values, isValid, isSubmitting, setFieldValue }) => {
                  return (
                    <Form autoComplete='off'>
                      <Flex py={6} alignItems='center'>
                        <Box as='h2' fontSize={['sm', '3xl']} fontWeight='700' color='grey.800'>
                          Nouveau formulaire
                        </Box>
                        <Spacer />
                        <Button
                          type='submit'
                          size={buttonSize}
                          variant='form'
                          leftIcon={<AiOutlineEdit />}
                          isActive={isValid}
                          isDisabled={!isValid || isSubmitting}
                        >
                          Enregistrer les informations
                        </Button>
                      </Flex>
                      <Grid templateColumns='repeat(12, 1fr)'>
                        <GridItem colSpan={12} bg='white' p={8} border='1px solid' borderColor='bluefrance.500'>
                          <Grid templateColumns='repeat(12, 1fr)'>
                            <GridItem colSpan={[12, 6]} p={[, 8]}>
                              <Heading size='md' pb={6}>
                                Renseignements Entreprise
                              </Heading>
                              <RechercheSiret
                                validSIRET={validSIRET}
                                submitSiret={submitSiret}
                                siretInformation={siretInformation}
                              />
                            </GridItem>
                            <GridItem colSpan={[12, 6]} p={[, 8]}>
                              <Heading size='md' pb={6}>
                                Informations de contact
                              </Heading>
                              <CustomInput name='nom' label='Nom' type='text' value={values.nom} />
                              <CustomInput name='prenom' label='Prénom' type='test' value={values.prenom} />
                              <CustomInput
                                name='telephone'
                                label='Téléphone'
                                type='tel'
                                pattern='[0-9]{10}'
                                maxLength='10'
                                value={values.telephone}
                                // helper='ex: 0632923456'
                              />
                              <CustomInput name='email' label='Email' type='email' value={values.email} />
                            </GridItem>
                          </Grid>
                        </GridItem>
                      </Grid>
                    </Form>
                  )
                }}
              </Formik>
            )}

            {formState?._id && formState.adresse && formState.prenom && formState.nom ? (
              <Box mb={12}>
                <Flex pt={12} pb={6} alignItems='center'>
                  <Box textStyle='h3' fontSize={['sm', '3xl']} fontWeight='700' color='grey.800'>
                    Offre(s) disponible(s)
                  </Box>
                  <Spacer />
                  <Button variant='primary' size={buttonSize} leftIcon={<IoIosAddCircleOutline />} onClick={addOffer}>
                    Ajouter une offre
                  </Button>
                </Flex>
                {hasActiveOffers.length > 0 ? (
                  <ListeVoeux
                    data={offersList}
                    removeOffer={removeOffer}
                    editOffer={editOffer}
                    extendOffer={extendOffer}
                    geo_coordonnees={formState.geo_coordonnees}
                  />
                ) : (
                  <Flex
                    direction='column'
                    alignItems='center'
                    bg='white'
                    p={8}
                    border='1px solid'
                    borderColor='grey.400'
                  >
                    <Image src={addOfferImage} pb={3} />
                    <Box align='center' textStyle='h3' fontSize={['md', '3xl']} fontWeight='700' color='grey.800'>
                      Créez votre première offre d'emploi en alternance
                    </Box>
                    <Text align='center'>En quelques secondes, exprimez vos besoins de recrutement pour les</Text>
                    <Text align='center'>
                      afficher sur le site <span style={{ fontWeight: 700 }}>La Bonne Alternance</span> dès aujourd’hui.
                    </Text>
                    <Button
                      mt={6}
                      mb={3}
                      variant='primary'
                      size={buttonSize}
                      leftIcon={<IoIosAddCircleOutline />}
                      onClick={addOffer}
                    >
                      Ajouter une offre
                    </Button>
                  </Flex>
                )}
              </Box>
            ) : (
              <Alert status='info' variant='top-accent' mt={5}>
                <AlertIcon />
                Veuillez compléter les informations ci-dessus pour pouvoir déposer vos offres
              </Alert>
            )}
          </Container>
        </Layout>
      </AnimationContainer>
    </>
  )
}
