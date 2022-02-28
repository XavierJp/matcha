import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { getRomeDetail } from '../../../api'
import { AnimationContainer } from '../../../components'
import { InfoCircle } from '../../../theme/components/icons'
import { J1S, Lba, Parcoursup } from '../../../theme/components/logos'
import AuthentificationLayout from '../../authentification/components/Authentification-layout'
import AjouterVoeux from './AjouterVoeux'
import './voeux.css'

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

  const RomeDetails = (rome, formik) => {
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
            <AjouterVoeux {...props} romeDetails={RomeDetails} />
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
