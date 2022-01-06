import { useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import Layout from '../../components/Layout'
import { Flex, Container, Button, SimpleGrid, Box, Heading, Image, Text, Link, Stack, useToast } from '@chakra-ui/react'
import { ArrowLeft, ArrowRightLine } from '../../theme/components/icons'
import illustrationCfa from '../../assets/images/illustration-cfa.svg'
import CustomInput from '../formulaire/components/CustomInput'
import { postCfaLanding } from '../../api'
import { AnimationContainer } from '../../components'
import { EditorialContainer, EditorialTextBlock } from './components'

export default () => {
  const toast = useToast()
  const navigate = useNavigate()

  return (
    <AnimationContainer>
      <Layout background='white'>
        <Container maxW='container.xl' py={4}>
          <Button
            leftIcon={<ArrowLeft />}
            variant='link'
            sx={{ color: 'black', fontSize: '14px', fontWeight: '400' }}
            onClick={() => navigate('/')}
          >
            Page d'accueil Matcha
          </Button>
          <SimpleGrid columns={[1, 2]} spacing={6} pt={6}>
            <Box>
              <Heading fontSize='32px' color='bluefrance.500' pb={2}>
                Développer votre réseau d'entreprises partenaires
              </Heading>
              <Text pb={2}>
                Vous êtes un centre de formation ? Avec Matcha, retrouvez facilement les entreprises autour de chez vous
                prêtes à recruter vos apprenti(e)s. Accompagnez ces entreprises dans la diffusion et la gestion de leurs
                offres au sein de votre réseau afin d'établir des liens de confiance et développer votre réseau de
                partenaire.
              </Text>
              <Text fontSize='12px' pb={6} fontStyle='italic'>
                Dans le cadre de ce service, la prestation de recrutement doit être gratuite et ne pourra donner lieu à
                aucune facturation.
              </Text>
              <Formik
                validateOnMount={true}
                initialValues={{
                  siret: '',
                  email: '',
                }}
                validationSchema={Yup.object().shape({
                  siret: Yup.string()
                    .matches(/^[0-9]+$/, 'Le siret est composé uniquement de chiffres')
                    .min(14, 'le siret est sur 14 chiffres')
                    .max(14, 'le siret est sur 14 chiffres')
                    .required('champs obligatoire'),

                  email: Yup.string().email('Insérez un email valide').required('champ obligatoire'),
                })}
                onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
                  postCfaLanding({ ...values, type: 'CFA' })
                    .then((data) => {
                      setSubmitting(false)
                      toast({
                        title: 'Demande enregistrée avec succès.',
                        description: "Vous serez recontacté d'ici peu.",
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
                {({ values, isValid, isSubmitting }) => {
                  return (
                    <Box w={['auto', '90%']}>
                      <Form>
                        <CustomInput
                          name='siret'
                          type='text'
                          label='Le SIRET de votre centre de formation'
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
                        <Text fontSize='14px' color='grey.425' pt={3} pb={6}>
                          Vos données seront utilisées par Matcha dans le seul but de vous mettre en relation avec un
                          entreprises. Pour en savoir plus sur vos données et sur vos droits,{' '}
                          <Link textDecoration='underline' color='bluefrance.500'>
                            {' '}
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
                          Identifier des entreprises partenaires
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
              header='Comment identifier des entreprises partenaires avec Matcha'
              content={[
                {
                  title: 'Renseignez vos informations',
                  description:
                    'Le numéro de SIRET nous permettra de facilement localiser votre entreprise et ainsi vous proposer des partenaires à proximité.',
                },
                {
                  title: 'Développez votre réseau',
                  description:
                    "Une fois le formulaire envoyé, nous vous transmettrons par email la liste des entreprises actuellement à la recherche d'alternants dans votre région afin de prendre contact avec eux.",
                },
                {
                  title: ' ',
                  description: '',
                },
              ]}
            />
            <EditorialTextBlock
              header='Pourquoi accompagner des entreprises partenaires ?'
              content={[
                {
                  title: 'Gérez les candidatures pour le compte des entreprises',
                  description:
                    'Trouvez des entreprises proches de votre organisme de formation pour leur proposer des candidat(e)s en formation chez vous',
                },
                {
                  title: 'Développez votre réseau de  partenaires',
                  description:
                    "Développez des relations de confiance avec les entreprises de votre région en les accompagnants dans leurs recherches d'alternants",
                },
                {
                  title: 'Démultipliez les débouchées pour vos alternants',
                  description:
                    "Facilitez l'entrée des jeunes en alternance et en formation en leurs proposant des offres complètes : formation et entreprise d'accueil.",
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
