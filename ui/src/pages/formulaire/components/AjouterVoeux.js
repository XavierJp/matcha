import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  List,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Formik } from 'formik'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { getRomeDetail, postOffre } from '../../../api'
import { AnimationContainer, DropdownCombobox } from '../../../components'
import { LogoContext } from '../../../contextLogo'
import { ArrowRightLine, ExternalLinkLine, InfoCircle, ThumbDown, ThumbUp } from '../../../theme/components/icons'
import { J1S, Lba, Parcoursup } from '../../../theme/components/logos'
import AuthentificationLayout from '../../authentification/components/Authentification-layout'
import './voeux.css'

const DATE_FORMAT = 'YYYY-MM-DD'

const AjouterVoeux = (props) => {
  const [inputJobItems, setInputJobItems] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  const id_form = location.state?.id_form
  const email = location.state?.email

  const minDate = dayjs().format(DATE_FORMAT)
  const { organisation } = useContext(LogoContext)

  const handleJobSearch = async (search) => {
    if (search) {
      try {
        // const result = await fetch(
        //   `https://labonnealternance.apprentissage.beta.gouv.fr/api/romelabels?title=${search}`
        // )
        const result = await fetch(
          `https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/metiers/intitule?label=${search}`
        )
        const data = await result.json()
        return data.intitule
      } catch (error) {
        throw new Error(error)
      }
    }
    return inputJobItems
  }

  const submitFromDashboard = async (values, { resetForm }) => {
    await props.handleSave(values)
    resetForm({})
    props.onClose()
  }

  const submitFromDepotRapide = (values) => {
    postOffre(id_form, values).then((result) => {
      navigate('/creation/fin', { replace: true, state: { offre: result.data.offres[0], email } })
    })
  }

  return (
    <Formik
      validateOnMount
      enableReinitialize={true}
      initialValues={{
        libelle: props.libelle ?? '',
        romes: props.romes ?? [],
        niveau: props.niveau ?? '',
        date_debut_apprentissage: props.date_debut_apprentissage
          ? dayjs(props.date_debut_apprentissage).format(DATE_FORMAT)
          : '',
        description: props.description ?? undefined,
        date_creation: props.date_creation ?? dayjs().format(DATE_FORMAT),
        date_expiration: props.date_expiration ?? dayjs().add(1, 'month').format(DATE_FORMAT),
        statut: props.statut ?? 'Active',
        type: props.type ?? ['Apprentissage'],
        multi_diffuser: props.multi_diffuser ?? undefined,
        delegate: props.delegate ?? undefined,
        rome_detail: {},
      }}
      validationSchema={Yup.object().shape({
        libelle: Yup.string().required('Champ obligatoire'),
        niveau: Yup.string().required('Champ obligatoire'),
        date_debut_apprentissage: Yup.date().required('Champ obligatoire'),
        type: Yup.array().required('Champ obligatoire'),
        multi_diffuser: Yup.boolean(),
      })}
      onSubmit={
        props.fromDashboard
          ? (values, bag) => submitFromDashboard(values, bag)
          : (values) => submitFromDepotRapide(values)
      }
    >
      {(formik) => {
        let { values, setFieldValue, handleChange, errors, touched, isValid, isSubmitting, dirty, submitForm } = formik
        return (
          <>
            <FormControl isRequired>
              <FormLabel>Métier</FormLabel>
              <DropdownCombobox
                handleSearch={handleJobSearch}
                inputItems={inputJobItems}
                setInputItems={setInputJobItems}
                saveSelectedItem={(values) => {
                  /**
                   * validator broken when using setFieldValue : https://github.com/formium/formik/issues/2266
                   * work around until v3 : setTimeout
                   */
                  setTimeout(() => {
                    setFieldValue('libelle', values.intitule)
                    setFieldValue('romes', [values.codeRome])
                  }, 0)

                  props.romeDetails(values.codeRome, formik)
                }}
                name='libelle'
                value={values.libelle}
                placeholder='Rechercher un métier..'
              />
              {errors.libelle && touched.libelle && <FormErrorMessage>{errors.libelle}</FormErrorMessage>}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>
                <Flex alignItems='flex-end'>
                  Type de contrat{' '}
                  <Link
                    href='https://www.service-public.fr/professionnels-entreprises/vosdroits/F31704'
                    isExternal
                    ml={1}
                  >
                    <Flex>
                      <Text fontSize='sm' color='grey.500'>
                        en savoir plus
                      </Text>
                      <ExternalLinkLine color='grey.500' ml='3px' w={3} />
                    </Flex>
                  </Link>
                </Flex>
              </FormLabel>
              <CheckboxGroup
                onChange={(value) => {
                  setFieldValue('type', value)
                }}
                value={values.type}
                defaultValue={['Apprentissage']}
              >
                <Stack direction='row' spacing={5}>
                  <Checkbox value='Apprentissage'>Apprentissage</Checkbox>
                  <Checkbox value='Professionnalisation'>Professionnalisation</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Niveau de formation</FormLabel>
              <Select variant='outline' size='md' name='niveau' defaultValue={values.niveau} onChange={handleChange}>
                <option value='' hidden>
                  Choisissez un niveau
                </option>
                <option value='Cap, autres formations niveau (Infrabac)'>
                  Cap, autres formations niveau (Infrabac)
                </option>
                <option value='BP, Bac, autres formations niveau (Bac)'>BP, Bac, autres formations niveau (Bac)</option>
                <option value='BTS, DEUST, autres formations niveau (Bac+2)'>
                  BTS, DEUST, autres formations niveau (Bac+2)
                </option>
                <option value='Licence, autres formations niveau (Bac+3)'>
                  Licence, autres formations niveau (Bac+3)
                </option>
                <option value='Master, titre ingénieur, autres formations niveau (Bac+5)'>
                  Master, titre ingénieur, autres formations niveau (Bac+5)
                </option>
              </Select>
              {errors.niveau && touched.niveau && <FormErrorMessage>{errors.niveau}</FormErrorMessage>}
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Date de début</FormLabel>
              <Input
                type='date'
                name='date_debut_apprentissage'
                min={minDate}
                defaultValue={values.date_debut_apprentissage}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={8}>
              <Box p={3} bg='beige' borderBottom='4px solid #000091'>
                <FormLabel>
                  Avez-vous déjà déposé cette offre sur une autre plateforme (Pôle Emploi, Indeed ...) ?
                </FormLabel>
                <Stack align='flex-start' spacing={5} my={5}>
                  <Button
                    leftIcon={<ThumbUp />}
                    variant='secondary'
                    isActive={values.multi_diffuser === true ? true : false}
                    onClick={() => setFieldValue('multi_diffuser', true)}
                  >
                    Oui, l'offre est également ailleurs
                  </Button>
                  <Button
                    leftIcon={<ThumbDown />}
                    variant='secondary'
                    isActive={values.multi_diffuser === false ? true : false}
                    onClick={() => setFieldValue('multi_diffuser', false)}
                  >
                    Non, l'offre est uniquement sur Matcha
                  </Button>
                </Stack>
              </Box>
            </FormControl>

            {(values.description || organisation?.includes('akto')) && (
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea rows='6' name='description' defaultValue={values.description} onChange={handleChange} />
                <FormHelperText>
                  Insérer ici une description de l'offre d'apprentissage, un lien vers la fiche de poste ou tout élément
                  permettant de présenter le poste à pourvoir.
                </FormHelperText>
              </FormControl>
            )}

            <Flex justify='flex-end' mt={5}>
              <Button
                leftIcon={<ArrowRightLine />}
                variant='form'
                isDisabled={!(isValid && dirty) || isSubmitting}
                isActive={isValid}
                onClick={submitForm}
              >
                Créer l'offre
              </Button>
            </Flex>
          </>
        )
      }}
    </Formik>
  )
}

const Information = (props) => {
  let { definition, competencesDeBase } = props

  if (definition) {
    const definitionSplitted = definition.split('\\n')

    return (
      <>
        <Box border='1px solid #000091' p={5}>
          <Heading fontSize='24px' mb={3}>
            {props.libelle}
          </Heading>
          <Flex alignItems='flex-start' mb={6}>
            <InfoCircle mr={2} mt={1} />
            <Text textAlign='justify'>
              Voici la description visible par les candidats lors de la mise en ligne de l’offre d’emploi en alternance.
            </Text>
          </Flex>
          <Accordion defaultIndex={[0]} reduceMotion>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Text fontWeight='700' flex='1' textAlign='left'>
                    Description du métier
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <List>
                  <ul>
                    {definitionSplitted.map((x) => {
                      return <li>{x}</li>
                    })}
                  </ul>
                </List>
              </AccordionPanel>
            </AccordionItem>
            <hr />
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Text fontWeight='700' flex='1' textAlign='left'>
                    Quelles sont les compétences attendues ?
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <List>
                  <ul>
                    {competencesDeBase.map((x) => (
                      <li>{x.libelle}</li>
                    ))}
                  </ul>
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </>
    )
  } else {
    return (
      <>
        <Box border='1px solid #000091' p={5}>
          <Heading fontSize='24px' mb={3}>
            Dites-nous en plus sur votre besoin en recrutement
          </Heading>
          <Flex alignItems='flex-start' mb={6}>
            <InfoCircle mr={2} mt={1} />
            <Text textAlign='justify'>Cela permettra à votre offre d'être visible des candidats intéressés.</Text>
          </Flex>
          <Box ml={5}>
            <Text>Une fois créée, votre offre d’emploi sera immédiatement mise en ligne sur les sites suivants : </Text>
            <Stack direction={['column', 'row']} spacing={2} align='center' mt={3}>
              <Lba h='100px' />
              <J1S w='100px' h='100px' />
              <Parcoursup w='220px' h='100px' />
            </Stack>
          </Box>
        </Box>
      </>
    )
  }
}

export default (props) => {
  const [romeInformation, setRomeInformation] = useState({})
  const [loading, setLoading] = useState(false)

  const romeDetails = (rome, formik) => {
    getRomeDetail(rome)
      .then((result) => {
        setLoading(true)
        formik.setFieldValue('rome_detail', result.data)
        setRomeInformation(result.data)
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 700)
      })
  }

  return (
    <AnimationContainer>
      <AuthentificationLayout fromDashboard={props.fromDashboard} onClose={props.onClose}>
        <Grid templateRows={['1fr', '.5fr 2fr']} templateColumns={['1fr', '4fr 5fr']} gap={4}>
          <GridItem px={[4, 8]} pt={[6, 12]}>
            <Heading fontSize='32px'>Votre besoin de recrutement</Heading>
            <Text fontSize='20px' pt='32px'>
              Merci de renseigner les champs ci-dessous pour créer votre offre
            </Text>
          </GridItem>
          <GridItem rowStart={2} p={[4, 8]}>
            <AjouterVoeux {...props} romeDetails={romeDetails} />
          </GridItem>
          <GridItem rowStart={['auto', 2]} pt={[4, 8]} px={[4, 'auto']}>
            {loading ? (
              <Flex h='100%' justify='center' align='center' direction='column'>
                <Spinner thickness='4px' speed='0.5s' emptyColor='gray.200' color='bluefrance.500' size='xl' />
                <Text>Recherche en cours...</Text>
              </Flex>
            ) : (
              <Information {...romeInformation} />
            )}
          </GridItem>
        </Grid>
      </AuthentificationLayout>
    </AnimationContainer>
  )
}
