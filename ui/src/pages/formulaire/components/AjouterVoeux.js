import { useState, useRef, useContext } from 'react'
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Textarea,
  FormErrorMessage,
  Input,
  Text,
  Heading,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Link,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import moment from 'moment'
import * as Yup from 'yup'

import 'moment/locale/fr'

import { DropdownCombobox } from '../../../components'
import { ArrowRightLine, Close, ExternalLinkLine } from '../../../theme/components/icons'
import { LogoContext } from '../../../contextLogo'

const DATE_FORMAT = 'YYYY-MM-DD'

export default (props) => {
  let { isOpen, onClose, handleSave } = props
  const [inputJobItems, setInputJobItems] = useState([])
  const initialRef = useRef()
  const finalRef = useRef()
  const minDate = moment().format(DATE_FORMAT)
  const { organisation } = useContext(LogoContext)

  const handleJobSearch = async (search) => {
    if (search) {
      try {
        const result = await fetch(
          `https://labonnealternance.apprentissage.beta.gouv.fr/api/romelabels?title=${search}`
        )
        const data = await result.json()
        return data.labelsAndRomes
      } catch (error) {
        throw new Error(error)
      }
    }
    return inputJobItems
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        libelle: props.libelle ?? '',
        romes: props.romes ?? [],
        niveau: props.niveau ?? '',
        date_debut_apprentissage: props.date_debut_apprentissage
          ? moment(props.date_debut_apprentissage).format(DATE_FORMAT)
          : '',
        description: props.description ?? '',
        date_creation: props.date_creation ?? moment().format(DATE_FORMAT),
        date_expiration: props.date_expiration ?? moment().add(1, 'months').format(DATE_FORMAT),
        statut: props.statut ?? 'Active',
        type: props.type ?? 'Apprentissage',
      }}
      validationSchema={Yup.object().shape({
        libelle: Yup.string().required('Champ obligatoire'),
        niveau: Yup.string().required('Champ obligatoire'),
        date_debut_apprentissage: Yup.date(),
        description: Yup.string(),
        type: Yup.string().required('Champ obligatoire'),
      })}
      onSubmit={async (values, { resetForm }) => {
        await handleSave(values)
        resetForm({})
        onClose()
      }}
    >
      {(props) => {
        let { values, setFieldValue, handleChange, errors, touched, isValid, isSubmitting, dirty, submitForm } = props
        return (
          <Modal
            closeOnOverlayClick={false}
            blockScrollOnMount={true}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent mt={['0', '3.75rem']} h={['100%', 'auto']} mb={0} borderRadius={0}>
              <Button
                display={'flex'}
                alignSelf={'flex-end'}
                color='bluefrance.500'
                fontSize={'epsilon'}
                onClick={onClose}
                variant='unstyled'
                p={6}
                fontWeight={400}
              >
                fermer
                <Text as={'span'} ml={2}>
                  <Close boxSize={4} />
                </Text>
              </Button>
              {/* <ModalHeader px={[4, 16]} pt={[3, 6]} pb={[3, 6]}> */}
              <ModalHeader>
                <Heading as='h2' fontSize='1.5rem'>
                  <Flex>
                    <Text as={'span'}>
                      <ArrowRightLine boxSize={26} />
                    </Text>
                    <Text as={'span'} ml={4}>
                      Ajouter une offre
                    </Text>
                  </Flex>
                </Heading>
              </ModalHeader>
              <ModalBody pb={6}>
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
                        setFieldValue('libelle', values.label)
                        setFieldValue('romes', values.romes)
                      }, 0)
                    }}
                    name='libelle'
                    value={values.libelle}
                    placeholder="Rechercher un domaine d'activité.."
                    ref={initialRef}
                  />
                  {errors.libelle && touched.libelle && <FormErrorMessage>{errors.libelle}</FormErrorMessage>}
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>Formation minimum attendue</FormLabel>
                  <Select size='lg' name='niveau' defaultValue={values.niveau} onChange={handleChange}>
                    <option value='' hidden>
                      Choisissez un niveau
                    </option>
                    <option value='CAP, BEP'>CAP, BEP</option>
                    <option value='Baccalauréat'>Baccalauréat</option>
                    <option value='DEUG, BTS, DUT, DEUST'>DEUG, BTS, DUT, DEUST</option>
                    <option value='Licence, Licence professionnelle'>Licence, Licence professionnelle</option>
                    <option value='Maitrise, master 1'>Maitrise, master 1</option>
                    <option value='Master 2, DEA, DESS, Ingénieur'>Master 2, DEA, DESS, Ingénieur</option>
                    <option value='Doctorat, recherche'>Doctorat, recherche</option>
                  </Select>
                  {errors.niveau && touched.niveau && <FormErrorMessage>{errors.niveau}</FormErrorMessage>}
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Date de début</FormLabel>
                  <Input
                    type='date'
                    name='date_debut_apprentissage'
                    min={minDate}
                    defaultValue={values.date_debut_apprentissage}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Type de contrat</FormLabel>
                  <RadioGroup
                    onChange={(value) => {
                      setFieldValue('type', value)
                    }}
                    value={values.type}
                  >
                    <Stack direction='row' spacing={5}>
                      <Radio value='Apprentissage'>Apprentissage</Radio>
                      <Radio value='Professionnalisation'>Professionnalisation</Radio>
                    </Stack>
                  </RadioGroup>
                  <FormHelperText>
                    <Link href='https://www.service-public.fr/professionnels-entreprises/vosdroits/F31704' isExternal>
                      voir plus d'informations sur les types de contrat <ExternalLinkLine mb='2px' />
                    </Link>
                  </FormHelperText>
                </FormControl>

                {(values.description || organisation.includes('akto')) && (
                  <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Textarea rows='6' name='description' defaultValue={values.description} onChange={handleChange} />
                    <FormHelperText>
                      Insérer ici une description de l'offre d'apprentissage, un lien vers la fiche de poste ou tout
                      élément permettant de présenter le poste à pourvoir.
                    </FormHelperText>
                  </FormControl>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  variant='primary'
                  isFullWidth={true}
                  disabled={!(isValid && dirty) || isSubmitting}
                  onClick={submitForm}
                >
                  Enregistrer
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )
      }}
    </Formik>
  )
}
