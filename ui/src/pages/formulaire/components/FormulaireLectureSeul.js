import { Button, Box, Flex, Grid, GridItem, Text, Heading, Spacer, useBreakpointValue, Badge } from '@chakra-ui/react'
import { AiOutlineEdit } from 'react-icons/ai'

export default ({ formState, buttonSize, setEditionMode }) => {
  const gridTemplate = useBreakpointValue(['1fr', formState.mandataire ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'])
  return (
    <>
      <Flex py={6} alignItems='center'>
        <Box as='h2' fontSize={['sm', '3xl']} fontWeight='700' color='grey.800' maxW={[100, 'none']}>
          {formState.raison_sociale}
        </Box>
        <Spacer />
        <Button
          type='submit'
          size={buttonSize}
          variant='primary'
          leftIcon={<AiOutlineEdit />}
          onClick={() => setEditionMode.toggle(false)}
        >
          Editer les informations
        </Button>
      </Flex>
      <Grid
        templateColumns={gridTemplate}
        py={6}
        p={8}
        bg='white'
        border='1px solid'
        borderColor='bluefrance.500'
        gap={[6, 0]}
      >
        {formState.mandataire && (
          <GridItem>
            <Heading size='md' pb={6}>
              Renseignements Mandataire
            </Heading>
            <Grid templateRows='repeat(3, 1fr)' gap={4}>
              <Flex>
                <Text pr={3}>Nom de l'etablissement :</Text>
                <Badge variant='readOnly'>{formState.raison_sociale_mandataire}</Badge>
              </Flex>
              <Flex>
                <Text pr={3}>SIRET :</Text>
                <Badge variant='readOnly'>{formState.siret_mandataire}</Badge>
              </Flex>
              <Flex>
                <Text pr={3} isTruncated>
                  Adresse :
                </Text>
                <Badge variant='readOnly'>{formState.adresse_mandataire}</Badge>
              </Flex>
            </Grid>
          </GridItem>
        )}
        <GridItem>
          <Heading size='md' pb={6}>
            Renseignements Entreprise
          </Heading>
          <Grid templateRows='repeat(3, 1fr)' gap={4}>
            <Flex direction={['column', 'row']}>
              <Text pr={3} pb={[3, 0]}>
                Nom de l'enseigne :
              </Text>
              <Badge variant='readOnly'>{formState.raison_sociale}</Badge>
            </Flex>
            <Flex direction={['column', 'row']}>
              <Text pr={3} pb={[3, 0]}>
                SIRET :
              </Text>
              <Badge variant='readOnly'>{formState.siret}</Badge>
            </Flex>
            <Flex direction={['column', 'row']}>
              <Text pr={3} pb={[3, 0]}>
                Adresse :
              </Text>
              <Badge variant='readOnly'>{formState.adresse}</Badge>
            </Flex>
          </Grid>
        </GridItem>
        <GridItem>
          <Heading size='md' pb={6}>
            Informations de contact
          </Heading>
          <Grid templateRows='repeat(4, 1fr)' gap={4}>
            <Flex direction={['column', 'row']}>
              <Text pr={3} pb={[3, 0]}>
                Nom :
              </Text>
              <Badge variant='readOnly'>{formState.nom}</Badge>
            </Flex>
            <Flex direction={['column', 'row']}>
              <Text pr={3} pb={[3, 0]}>
                Prénom :
              </Text>
              <Badge variant='readOnly'>{formState.prenom}</Badge>
            </Flex>
            <Flex direction={['column', 'row']}>
              <Text pr={3} pb={[3, 0]}>
                Téléphone :
              </Text>
              <Badge variant='readOnly'>{formState.telephone}</Badge>
            </Flex>
            <Flex direction={['column', 'row']}>
              <Text pr={3} pb={[3, 0]}>
                Email :
              </Text>
              <Badge variant='readOnly'>{formState.email}</Badge>
            </Flex>
          </Grid>
        </GridItem>
      </Grid>
    </>
  )
}
