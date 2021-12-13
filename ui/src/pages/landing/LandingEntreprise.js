import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'

import Layout from '../../components/Layout'
import {
  Container,
  Button,
  SimpleGrid,
  Box,
  Heading,
  Image,
  Text,
  Link,
  Stack,
  useToast,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRightLine, Close } from '../../theme/components/icons'
import illustrationCfa from '../../assets/images/illustration-cfa.svg'
import CustomInput from '../formulaire/components/CustomInput'
import { getMetier, postEntrepriseLanding } from '../../api'
import { AnimationContainer } from '../../components'
import { EditorialContainer, EditorialTextBlock } from './components'
import { DropdownCombobox } from '../../components'

export default () => {
  const toast = useToast()
  const history = useHistory()
  const [metier, setMetier] = useState([])

  const handleJobSearch = async (search) => {
    if (search) {
      const { data } = await getMetier(search)
      return data.labelsAndRomes
    }
    return metier
  }

  return (
    <AnimationContainer>
      <Layout background='white'>
        <Container maxW='container.xl' py={4}>
          <Button
            leftIcon={<ArrowLeft />}
            variant='link'
            sx={{ color: 'black', fontSize: '14px', fontWeight: '400' }}
            onClick={() => history.push('/')}
          >
            Page d'accueil Matcha
          </Button>
          <SimpleGrid columns={[1, 2]} spacing={6} pt={6}>
            <Box>
              <Heading fontSize='32px' color='bluefrance.500' pb={2}>
                Déléguer simplement la gestion de vos offres
              </Heading>
              <Text pb={2}>
                Vous êtes une TPE-PME ? Avec Matcha, transmettez facilement vos offres aux centres de formation à
                proximité de votre entreprise afin de vous accompagner dans la diffusion et la gestion de vos offres et
                ainsi trouver l'alternant de vos rêves.
              </Text>
              <Text fontSize='12px' pb={6} fontStyle='italic'>
                La prestation de recrutement est gratuite et ne donnera lieu à aucune facturation de la part du CFA.
              </Text>
              <Formik
                validateOnMount={true}
                initialValues={{
                  siret: '',
                  email: '',
                  metiers: [],
                }}
                validationSchema={Yup.object().shape({
                  siret: Yup.string()
                    .matches(/^[0-9]+$/, 'Le siret est composé uniquement de chiffres')
                    .min(14, 'le siret est sur 14 chiffres')
                    .max(14, 'le siret est sur 14 chiffres')
                    .required('champs obligatoire'),

                  email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
                  metiers: Yup.array().min(1).required('Ajouter au moins un métier'),
                })}
                onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
                  postEntrepriseLanding({ ...values, type: 'ENTREPRISE' })
                    .then(() => {
                      setSubmitting(false)
                      toast({
                        title: 'Demande enregistré avec succès.',
                        description: "Vous serez recontacter d'ici peu.",
                        position: 'top-right',
                        status: 'success',
                        duration: 4000,
                      })
                      resetForm()
                    })
                    .catch(({ response }) => {
                      setFieldError('siret', response.data.message)
                      setSubmitting(false)
                    })
                }}
              >
                {({ values, isValid, isSubmitting, setFieldValue }) => {
                  return (
                    <Box w={['auto', '90%']}>
                      <Form>
                        <CustomInput
                          name='siret'
                          type='text'
                          label='Le SIRET de votre entreprise'
                          value={values.siret}
                          required={false}
                          maxLength='14'
                        />
                        <CustomInput
                          name='email'
                          type='text'
                          label='Votre adresse mail'
                          value={values.email}
                          required={false}
                        />
                        <Box>
                          <FormControl mb='22px' isDisabled={values.metiers.length === 3}>
                            <FormLabel mb='4px'>Dans quel domaine / Métier recherchez-vous un apprenti ?</FormLabel>
                            <FormHelperText mb='8px' fontSize='12px' mt='0px'>
                              Vous pouvez saisir jusqu'à 3 domaines / métiers différents
                            </FormHelperText>
                            <DropdownCombobox
                              clearInputOnSelect
                              handleSearch={handleJobSearch}
                              inputItems={metier}
                              setInputItems={setMetier}
                              saveSelectedItem={(val, reset) => {
                                /**
                                 * validator broken when using setFieldValue : https://github.com/formium/formik/issues/2266
                                 * work around until v3 : setTimeout
                                 */
                                if (val?.label) {
                                  setTimeout(() => {
                                    setFieldValue('metiers', [
                                      ...values.metiers,
                                      { libelle: val.label, romes: val.romes },
                                    ])
                                    reset()
                                  }, 0)
                                }
                              }}
                              name='metiers'
                              placeholder=' '
                            />
                          </FormControl>
                          <FieldArray name='metiers'>
                            {({ remove }) => (
                              <Stack direction='column' align='flex-start' spacing='24px'>
                                {values.metiers.length > 0 &&
                                  values.metiers.map(({ libelle }, index) => {
                                    return (
                                      <Button
                                        variant='pill'
                                        sx={{
                                          backgroundColor: '#E3E3FD',
                                          color: '#000091',
                                          fontSize: '12px',
                                        }}
                                        rightIcon={<Close />}
                                        onClick={() => remove(index)}
                                        key={index}
                                      >
                                        {libelle}
                                      </Button>
                                    )
                                  })}
                              </Stack>
                            )}
                          </FieldArray>
                        </Box>
                        <Text fontSize='14px' color='grey.425' pt={3} pb={6}>
                          Vos données seront utilisées par Matcha dans le seul but de vous mettre en relation avec des
                          centres de formations. Pour en savoir plus sur vos données et sur vos droits,{' '}
                          <Link
                            textDecoration='underline'
                            color='bluefrance.500'
                            href='https://beta.gouv.fr/suivi/'
                            target='_blank'
                          >
                            consultez notre politique de confidentialité.
                          </Link>
                        </Text>
                        <Button
                          type='submit'
                          variant='form'
                          leftIcon={<ArrowRightLine />}
                          isActive={isValid}
                          isDisabled={!isValid || isSubmitting}
                        >
                          Transmettre mon besoin
                        </Button>
                      </Form>
                    </Box>
                  )
                }}
              </Formik>
            </Box>
            <Box display={['none', 'flex']}>
              <Image src={illustrationCfa} maxW='75%' />
            </Box>
          </SimpleGrid>
          <EditorialContainer>
            <EditorialTextBlock
              header="Comment transmettre mes offres d'alternance à des CFA ?"
              content={[
                {
                  title: 'Renseignez vos informations',
                  description:
                    'Le numéro de SIRET nous permettra de facilement localiser votre entreprise et ainsi vous proposer des partenaires à proximité.',
                },
                {
                  title: 'Décrivez votre besoin',
                  description:
                    'Pour que vous soient proposés les meilleurs partenaires possibles en adéquation avec votre projet, il vous faut renseigner votre besoin',
                },
                {
                  title: 'Identifiez et transmettez vos offres',
                  description:
                    "Une fois le formulaire envoyé, nous vous transmettrons par email la liste des CFA que nous avons sélectionné pour vous afin de transmettre vos offres d'alternances",
                },
                {
                  title: ' ',
                  description: '',
                },
              ]}
            />
            <EditorialTextBlock
              header='Pourquoi transmettre mes offres à un CFA ?'
              content={[
                {
                  title: 'Gagnez du temps',
                  description:
                    "En mandatant un CFA, celui-ci sera en charge de la diffusion, la gestion de votre offre et de la pré-sélection des candidats afin de trouver l'alternant répondant à vos besoins et aux valeurs de votre entreprise.",
                },
                {
                  title: "Rejoignez le réseau des acteurs de l'apprentissage de votre territoire",
                  description:
                    "Développez des relations de confiance avec les acteurs de l'apprentissage de votre territoire afin de promouvoir votre entreprise et vos métiers auprès des jeunes.",
                },
                {
                  title: "Présentez une offre d'alternance complète",
                  description:
                    "Facilitez l'entrée des jeunes en alternance et en formation en leurs proposant des offres complètes : formation et emploi",
                },
                {
                  title: ' ',
                  description: '',
                },
              ]}
            />
          </EditorialContainer>
        </Container>
      </Layout>
    </AnimationContainer>
  )
}
