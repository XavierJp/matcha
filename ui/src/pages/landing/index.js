import { useHistory } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import Layout from '../../components/Layout'
import { Flex, Container, Button, SimpleGrid, Box, Heading, Image, Text, Link, Stack, useToast } from '@chakra-ui/react'
import { ArrowLeft, ArrowRightLine } from '../../theme/components/icons'
import illustrationCfa from '../../assets/images/illustration-cfa.svg'
import CustomInput from '../formulaire/components/CustomInput'
import { postCfaLanding } from '../../api'
import { AnimationContainer } from '../../components'

const TextBlock = ({ content, header }) => {
  return (
    <Stack direction='column' spacing='32px' borderBottom='4px solid #000091'>
      <Heading fontSize='22px' fontWeight='700' color='bluefrance.500'>
        {header}
      </Heading>
      {content.map((c) => {
        return (
          <Box key={c.title}>
            <Text fontWeight='700' pb={2}>
              {c.title}
            </Text>
            <Text>{c.description}</Text>
          </Box>
        )
      })}
    </Stack>
  )
}

export default () => {
  const toast = useToast()
  const history = useHistory()

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
                Développer votre réseau d'entreprises partenaires
              </Heading>
              <Text pb={2}>
                Vous êtes un centre de formation? Avec Matcha, retrouvez facilement les entreprises autour de chez vous
                prêtes à recruter vos apprenti(e)s. Accompagnez ces entreprises dans la diffusion et la gestion de leurs
                offres au sein de votre réseau afin d'établir des liens de confiance et développer votre réseau de
                partenaire.
              </Text>
              <Text fontSize='12px' pb={6} fontStyle='italic'>
                La prestation de recrutement est gratuite et ne donnera lieu à aucune facturation.
              </Text>
              {/* <Text pb={2}>
              Merci de renseigner les informations ci-dessous pour recevoir la liste entreprises autour de chez vous,
              actuellement à la recherche d'apprenti(e)s afin d'être mis en relation avec elles:
            </Text> */}
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
                {({ values, isValid, isSubmitting }) => {
                  return (
                    <Form>
                      <CustomInput
                        name='siret'
                        type='text'
                        label='Le SIRET de votre centre de formation'
                        value={values.siret}
                        required={false}
                        maxLength='14'
                        width='90%'
                      />
                      <CustomInput
                        name='email'
                        type='text'
                        label='Votre adresse mail'
                        value={values.email}
                        required={false}
                        width='90%'
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
                        Identifier une entreprise partenaire
                      </Button>
                    </Form>
                  )
                }}
              </Formik>
            </Box>
            <Box display={['none', 'flex']}>
              <Image src={illustrationCfa} maxW='75%' />
            </Box>
          </SimpleGrid>
          <SimpleGrid columns={[1, 2]} spacing='30px' mt='47px' mb={['51px', '102px']}>
            <TextBlock
              header='Comment identifier des entreprises partenaires avec Matcha'
              content={[
                {
                  title: 'Renseignez vos informations',
                  description:
                    'Le numéro de SIRET nous permettra de facilement localiser votre entreprise et ainsi vous proposer des partenaires à proximité.',
                },
                {
                  title: 'Décrivez votre besoin',
                  description:
                    'Afin de vous suggérer les meilleurs partenaires possibles, nous avons besoin de connaitre votre besoin en alternance.',
                },
                {
                  title: 'Sélectionnez le/les CFA que vous souhaitez mandater',
                  description:
                    'Une fois le formulaire envoyé, nous vous transmettrons par email la liste des CFA que nous avons sélectionné pour vous.',
                },
                {
                  title: ' ',
                  description: '',
                },
              ]}
            />
            <TextBlock
              header='Pourquoi accompagner des entreprises partenaires'
              content={[
                {
                  title: 'Partenaire de confiance',
                  description:
                    'En mandatant un CFA, celui-ci sera en charge de la diffusion et de la gestion de votre offre au sein de son réseau. ',
                },
                {
                  title: 'Pré-sélection des candidats',
                  description:
                    'Le centre de formation vous présentera des candidatures en adéquation avec vos besoins et les valeurs de vos entreprises ',
                },
                {
                  title: 'Trouver des partenaires de confiance',
                  description:
                    "Développer des relations de confiance avec les acteurs de l'apprentissage afin de faire découvrir votre entreprise et vos métiers auprès des jeunes.",
                },
                {
                  title: "Offre d'alternance complète pour les apprentis",
                  description:
                    "Faciliter l'entrée des jeunes en alternance et en formation en leurs proposant des offres complètes: formation et métier",
                },
                {
                  title: ' ',
                  description: '',
                },
              ]}
            />
          </SimpleGrid>
        </Container>
      </Layout>
    </AnimationContainer>
  )
}
