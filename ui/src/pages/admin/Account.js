import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { getPartenaire, updatePartenaire } from '../../api'
import useAuth from '../../common/hooks/useAuth'
import AnimationContainer from '../../components/AnimationContainer'
import Layout from '../../components/Layout'
import { ArrowDropRightLine, ArrowRightLine, InfoCircle } from '../../theme/components/icons'
import CustomInput from '../formulaire/components/CustomInput'

export default () => {
  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const [auth] = useAuth()
  const toast = useToast()

  useEffect(() => {
    getPartenaire(auth.siret).then(({ data }) => setUser(data))
  }, [])

  return (
    <AnimationContainer>
      <Layout background='beige'>
        <Container maxW='container.xl' pb={16}>
          <Box mt='16px' mb={6}>
            <Breadcrumb separator={<ArrowDropRightLine color='grey.600' />} textStyle='xs'>
              <BreadcrumbItem>
                <BreadcrumbLink textDecoration='underline' onClick={() => navigate('/admin')} textStyle='xs'>
                  Administration des offres
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink textStyle='xs'>Modifier les informations de contact</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
          <Formik
            validateOnMount={true}
            enableReinitialize={true}
            initialValues={{
              nom: user.nom,
              prenom: user.prenom,
              telephone: user.telephone,
              email: user.email,
            }}
            validationSchema={Yup.object().shape({
              nom: Yup.string().required('champ obligatoire'),
              prenom: Yup.string().required('champ obligatoire'),
              telephone: Yup.string()
                .matches(/^[0-9]+$/, 'Le téléphone est composé uniquement de chiffres')
                .min(10, 'le téléphone est sur 10 chiffres')
                .max(10, 'le téléphone est sur 10 chiffres')
                .required('champ obligatoire'),
              email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true)
              updatePartenaire(user._id, values).then(({ data }) => {
                setUser(data)
                toast({
                  title: 'Mise à jour enregistrée avec succès',
                  position: 'top-right',
                  status: 'success',
                  duration: 2000,
                  isClosable: true,
                })
                setSubmitting(false)
              })
            }}
          >
            {({ values, isSubmitting, isValid }) => {
              return (
                <Box bg='white' p={8} border='1px solid' borderColor='bluefrance.500'>
                  <Heading fontSize='32px'>Vos informations de contact</Heading>
                  <SimpleGrid columns={2} spacing={10} mt={8}>
                    <Box>
                      <Form>
                        <CustomInput name='nom' label='Nom' type='text' value={values.nom} />
                        <CustomInput name='prenom' label='Prénom' type='test' value={values.prenom} />
                        <CustomInput
                          name='telephone'
                          label='Téléphone'
                          type='tel'
                          pattern='[0-9]{10}'
                          maxLength='10'
                          value={values.telephone}
                        />
                        <CustomInput name='email' label='Email' type='email' value={values.email} />
                        <Flex justify='flex-end' mt={10}>
                          <Button
                            type='submit'
                            size={buttonSize}
                            variant='form'
                            leftIcon={<ArrowRightLine />}
                            isActive={isValid}
                            isDisabled={!isValid || isSubmitting}
                            isLoading={isSubmitting}
                          >
                            Enregistrer
                          </Button>
                        </Flex>
                      </Form>
                    </Box>
                    <Box>
                      <Box border='1px solid #000091' p={['4', '8']}>
                        <Heading fontSize='24px' mb={3}>
                          Où seront visibles les informations de contact ?
                        </Heading>
                        <Flex alignItems='flex-start' alignItems='flex-start'>
                          <InfoCircle mr={2} mt={1} />
                          <Text textAlign='justify'>
                            Vos informations de contacts seront visibles sur les offres mises en ligne à partir de
                            Matcha pour vos entreprises partenaires.
                          </Text>
                        </Flex>
                        <Text mt={7} ml={5}>
                          Vous recevrez les candidatures sur l’email renseigné.
                        </Text>
                      </Box>
                    </Box>
                  </SimpleGrid>
                </Box>
              )
            }}
          </Formik>
        </Container>
      </Layout>
    </AnimationContainer>
  )
}
