import {
  Alert,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Link as ChakraLink,
  Spacer,
  Text,
  useBoolean,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { memo, useContext, useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { getEntrepriseInformation, getFormulaire, postFormulaire, postOffre, putFormulaire, putOffre } from '../../api'
import addOfferImage from '../../assets/images/add-offer.svg'
import useAuth from '../../common/hooks/useAuth'
import { AnimationContainer, Layout } from '../../components'
import { LogoContext } from '../../contextLogo'
import { ArrowDropRightLine, SearchLine } from '../../theme/components/icons'
import AjouterVoeux from './components/AjouterVoeux'
import ConfirmationSuppression from './components/ConfirmationSuppression'
import CustomInput from './components/CustomInput'
import FormulaireLectureSeul from './components/FormulaireLectureSeul'
import ListeVoeux from './components/ListeVoeux'

const SiretDetails = ({ raison_sociale, domaine, fullAdresse }) => {
  return (
    <>
      <CustomInput label='Raison Sociale' value={raison_sociale} name='raison_sociale' isDisabled required={false} />
      <CustomInput label="Domaine d'activité" value={domaine} name='domaine' isDisabled required={false} />
      <CustomInput label='Adresse' value={fullAdresse} name='adresse' isDisabled required={false} />
    </>
  )
}

const RechercheSiret = memo(({ submitSiret, validSIRET, siretInformation }) => {
  const buttonSize = useBreakpointValue(['sm', 'md'])

  return (
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
                    variant='form'
                    isLoading={siretForm.isSubmitting}
                    leftIcon={<SearchLine width={5} />}
                    isActive={siretForm.isValid && !siretForm.isSubmitting}
                    isDisabled={!siretForm.isValid || siretForm.isSubmitting}
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
  const [siretInformation, setSiretInformation] = useState({})
  const [currentOffer, setCurrentOffer] = useState({})
  const [offersList, setOffersList] = useState([])
  const [formState, setFormState] = useState({})

  const [readOnlyMode, setReadOnlyMode] = useBoolean()
  const [validSIRET, setValidSIRET] = useBoolean()
  const confirmationSuppression = useDisclosure()
  const [loading, setLoading] = useBoolean(true)
  const ajouterVoeuxPopup = useDisclosure()
  const [error, setError] = useBoolean()
  const toast = useToast()

  const { setOrganisation } = useContext(LogoContext)

  const { id_form, origine } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [auth] = useAuth()

  const newUser = location.state?.newUser ?? false
  const offerPopup = location.state?.offerPopup ?? false
  const gestionnaire = location.state?.gestionnaire ?? undefined
  const mandataire = location.state?.mandataire ?? false

  const hasActiveOffers = offersList.filter((x) => x.statut === 'Active')

  const buttonSize = useBreakpointValue(['sm', 'md'])

  useEffect(() => {
    if (id_form) {
      getFormulaire(id_form)
        .then((result) => {
          setFormState(result.data)
          setOrganisation(result.data.origine)
          setOffersList(result.data.offres)
          if (newUser) {
            toast({
              title: 'Vérification réussi',
              description: 'Votre adresse mail a été validée avec succès.',
              position: 'top-right',
              status: 'success',
              duration: 7000,
              isClosable: true,
            })
          }
          if (offerPopup) {
            ajouterVoeuxPopup.onOpen()
          }
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
        title: 'Offre mise à jour avec succès.',
        position: 'top-right',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } else {
      // create
      postOffre(formState.id_form, values).then((result) => setOffersList(result.data.offres))
      toast({
        title: 'Offre enregistrée avec succès.',
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
      title: "Offre prolongée d'un mois.",
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

  const delegateOffer = (idOffre, values) => {
    putOffre(idOffre, values).then((result) => {
      setOffersList(result.data.offres)
      toast({
        title: 'L’offre a été transmise à des organismes de formation.',
        position: 'top-right',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    })
  }

  const submitSiret = ({ siret }, { setSubmitting, setFieldError, setFieldValue }) => {
    // validate SIRET
    getEntrepriseInformation(siret)
      .then(({ data }) => {
        setSubmitting(true)
        setSiretInformation(data)
        setValidSIRET.on()
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
          title: 'Mise à jour enregistrée avec succès',
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
        navigate(`/formulaire/${result.data.id_form}`)
        toast({
          title: 'Formulaire créé avec succès.',
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
                  {auth.sub !== 'anonymous' && auth.type !== 'ENTREPRISE' ? (
                    <Breadcrumb separator={<ArrowDropRightLine color='grey.600' />} textStyle='xs'>
                      <BreadcrumbItem>
                        <BreadcrumbLink textDecoration='underline' onClick={() => navigate(-1)} textStyle='xs'>
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
                  mandataire,
                  gestionnaire,
                  raison_sociale: siretInformation.raison_sociale || formState?.raison_sociale,
                  siret: siretInformation.siret || formState?.siret,
                  adresse: siretInformation.fullAdresse || formState?.adresse,
                  geo_coordonnees: siretInformation.geo_coordonnees || formState?.geo_coordonnees,
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
                          {values.raison_sociale || "Nouveau dépot d'offre"}
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
                              {formState._id ? (
                                <>
                                  <CustomInput
                                    name='raison_sociale'
                                    label='Raison sociale'
                                    type='text'
                                    value={values.raison_sociale}
                                    isDisabled={true}
                                  />
                                  <CustomInput
                                    name='siret'
                                    label='Siret'
                                    type='text'
                                    value={values.siret}
                                    isDisabled={true}
                                  />
                                  <CustomInput
                                    name='adresse'
                                    label='Adresse'
                                    type='text'
                                    value={values.adresse}
                                    isDisabled={true}
                                  />
                                </>
                              ) : (
                                <RechercheSiret
                                  validSIRET={validSIRET}
                                  submitSiret={submitSiret}
                                  siretInformation={siretInformation}
                                />
                              )}
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
                    delegateOffer={delegateOffer}
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
