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
  Box,
} from '@chakra-ui/react'
import { Formik } from 'formik'

import * as Yup from 'yup'
import dayjs from 'dayjs'

import 'dayjs/locale/fr'

import { DropdownCombobox } from '../../../components'
import { ArrowRightLine, Close, ExternalLinkLine, ThumbDown, ThumbUp } from '../../../theme/components/icons'
import { LogoContext } from '../../../contextLogo'

const DATE_FORMAT = 'YYYY-MM-DD'

export default (props) => {
  let { isOpen, onClose, handleSave } = props
  const [inputJobItems, setInputJobItems] = useState([])
  const initialRef = useRef()
  const finalRef = useRef()

  const minDate = dayjs().format(DATE_FORMAT)
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
          ? dayjs(props.date_debut_apprentissage).format(DATE_FORMAT)
          : '',
        description: props.description ?? '',
        date_creation: props.date_creation ?? dayjs().format(DATE_FORMAT),
        date_expiration: props.date_expiration ?? dayjs().add(1, 'months').format(DATE_FORMAT),
        statut: props.statut ?? 'Active',
        type: props.type ?? 'Apprentissage',
        multi_diffuser: props.multi_diffuser ?? undefined,
      }}
      validationSchema={Yup.object().shape({
        libelle: Yup.string().required('Champ obligatoire'),
        niveau: Yup.string().required('Champ obligatoire'),
        date_debut_apprentissage: Yup.date().required('Champ obligatoire'),
        description: Yup.string(),
        type: Yup.string().required('Champ obligatoire'),
        multi_diffuser: Yup.boolean(),
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
                    placeholder='Rechercher un métier..'
                    ref={initialRef}
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
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>Niveau de formation</FormLabel>
                  <Select size='md' name='niveau' defaultValue={values.niveau} onChange={handleChange}>
                    <option value='' hidden>
                      Choisissez un niveau
                    </option>
                    <option value='Cap, autres formations niveau (Infrabac)'>
                      Cap, autres formations niveau (Infrabac)
                    </option>
                    <option value='BP, Bac, autres formations niveau (Bac)'>
                      BP, Bac, autres formations niveau (Bac)
                    </option>
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
