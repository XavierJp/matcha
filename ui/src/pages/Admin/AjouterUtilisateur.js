import { useRef } from 'react'
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
  Stack,
  FormErrorMessage,
  Input,
  Text,
  Heading,
  Flex,
  RadioGroup,
  Radio,
  FormHelperText,
} from '@chakra-ui/react'
import { ArrowRightLine, Close } from '../../theme/components/icons/'
import { Formik } from 'formik'
import * as Yup from 'yup'

export default (props) => {
  let { isOpen, onClose, handleSave } = props
  const initialRef = useRef()
  const finalRef = useRef()

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        nom: props.nom ?? '',
        prenom: props.prenom ?? '',
        username: props.username ?? '',
        organization: props.organization ?? '',
        scope: props.scope ?? '',
        email: props.email ?? '',
        isAdmin: props.isAdmin?.toString() ?? 'false',
        // mailSent: props.mail_sent ?? 'false',
      }}
      validationSchema={Yup.object().shape({
        nom: Yup.string().required('Champ obligatoire'),
        prenom: Yup.string().required('Champ obligatoire'),
        username: Yup.string().required('Champ obligatoire'),
        organization: Yup.string(),
        scope: Yup.string().required('Champs obligatoire'),
        email: Yup.string().email('Insérez un email valide').required('Champ obligatoire'),
        isAdmin: Yup.string(),
      })}
      onSubmit={async (values, { resetForm }) => {
        await handleSave(values)
        resetForm()
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

              <ModalHeader>
                <Heading as='h2' fontSize='1.5rem'>
                  <Flex>
                    <Text as={'span'}>
                      <ArrowRightLine boxSize={26} />
                    </Text>
                    <Text as={'span'} ml={4}>
                      Ajouter un utilisateur
                    </Text>
                  </Flex>
                </Heading>
              </ModalHeader>
              <ModalBody pb={6}>
                <Stack direction='row'>
                  <FormControl isRequired>
                    <FormLabel>Nom</FormLabel>
                    <Input type='text' name='nom' defaultValue={values.nom} onChange={handleChange} />
                    {errors.nom && touched.nom && <FormErrorMessage>{errors.nom}</FormErrorMessage>}
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Prénom</FormLabel>
                    <Input type='text' name='prenom' defaultValue={values.prenom} onChange={handleChange} />
                    {errors.prenom && touched.prenom && <FormErrorMessage>{errors.prenom}</FormErrorMessage>}
                  </FormControl>
                </Stack>

                <FormControl mt={4} isRequired>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <Input type='text' name='username' defaultValue={values.username} onChange={handleChange} />
                  {errors.username && touched.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
                  <FormHelperText>Login de l'utilisateur. ex: cci-bretagne</FormHelperText>
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type='text' name='email' defaultValue={values.email} onChange={handleChange} />
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>Organisation</FormLabel>
                  <Input type='text' name='organization' defaultValue={values.organization} onChange={handleChange} />
                  {errors.organization && touched.organization && (
                    <FormErrorMessage>{errors.organization}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>Origine de référence</FormLabel>
                  <Input type='text' name='scope' defaultValue={values.scope} onChange={handleChange} />
                  <FormHelperText>Rattache une origine spécifique à l'utilisateur. [all = full access]</FormHelperText>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Administrateur</FormLabel>
                  <RadioGroup onChange={(checked) => setFieldValue('isAdmin', checked)} value={values.isAdmin}>
                    <Stack spacing={10} direction='row'>
                      <Radio value={'true' || true}>Oui</Radio>
                      <Radio value={'false' || false}>Non</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
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