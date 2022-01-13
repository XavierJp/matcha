import { Button, Box, Flex, Grid, GridItem, Text, Heading, Spacer, useBreakpointValue, Badge } from '@chakra-ui/react'
import { AiOutlineEdit } from 'react-icons/ai'

export default ({ formState, buttonSize, setEditionMode }) => {
  const gridTemplate = useBreakpointValue(['1fr', 'repeat(2, 1fr)'])
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
        p={[4, 8]}
        bg='white'
        border='1px solid'
        borderColor='bluefrance.500'
        gap={[6, 0]}
      >
        <GridItem>
          <Heading size='md' pb={6}>
            Renseignements Entreprise
          </Heading>
          <Grid templateRows='repeat(3, 1fr)' gap={4}>
            <Flex direction={['column', 'row']} align={['flex-start', 'center']}>
              <Text pr={3} pb={[3, 0]}>
                Nom de l'enseigne :
              </Text>
              <Badge variant='readOnly'>{formState.raison_sociale}</Badge>
            </Flex>
            <Flex direction={['column', 'row']} align={['flex-start', 'center']}>
              <Text pr={3} pb={[3, 0]}>
                SIRET :
              </Text>
              <Badge variant='readOnly'>{formState.siret}</Badge>
            </Flex>
            <Flex direction={['column', 'row']} align={['flex-start', 'center']}>
              <Text pr={3} pb={[3, 0]}>
                Adresse :
              </Text>
              <Badge variant='readOnly' sx={{ maxWidth: '100%' }}>
                <Text isTruncated>{formState.adresse}</Text>
              </Badge>
            </Flex>
            {formState.opco && (
              <Flex direction={['column', 'row']} align={['flex-start', 'center']}>
                <Text pr={3} pb={[3, 0]}>
                  Opco de référence :
                </Text>
                <Badge variant='readOnly' sx={{ maxWidth: '100%' }}>
                  <Text isTruncated>{formState.opco.libelle}</Text>
                </Badge>
              </Flex>
            )}
          </Grid>
        </GridItem>
        <GridItem>
          <Heading size='md' pb={6}>
            Informations de contact
          </Heading>
          <Grid templateRows='repeat(4, 1fr)' gap={4}>
            <Flex direction={['column', 'row']} align={['flex-start', 'center']}>
              <Text pr={3} pb={[3, 0]}>
                Nom :
              </Text>
              <Badge variant='readOnly'>{formState.nom}</Badge>
            </Flex>
            <Flex direction={['column', 'row']} align={['flex-start', 'center']}>
              <Text pr={3} pb={[3, 0]}>
                Prénom :
              </Text>
              <Badge variant='readOnly'>{formState.prenom}</Badge>
            </Flex>
            <Flex direction={['column', 'row']} align={['flex-start', 'center']}>
              <Text pr={3} pb={[3, 0]}>
                Téléphone :
              </Text>
              <Badge variant='readOnly'>{formState.telephone}</Badge>
            </Flex>
            <Flex direction={['column', 'row']} align={['flex-start', 'center']}>
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
