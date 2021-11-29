import { Flex, Image, Box, Text, Button, useBreakpointValue, Link } from '@chakra-ui/react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { NavLink } from 'react-router-dom'
import addOfferImage from '../../../assets/images/add-offer.svg'
import useAuth from '../../../common/hooks/useAuth'

export default () => {
  const buttonSize = useBreakpointValue(['sm', 'md'])
  const [auth] = useAuth()

  return (
    <Flex direction='column' alignItems='center' bg='white' p={8} border='1px solid' borderColor='grey.400'>
      <Image src={addOfferImage} pb={3} />
      <Box align='center' textStyle='h3' fontSize={['md', '3xl']} fontWeight='700' color='grey.800'>
        Ajouter une nouvelle entreprise
      </Box>
      <Text>Des entreprises vous ont transmis des offres d’alternance ?</Text>
      <Text>Gérer facilement depuis cette espace la diffusion de leurs offres</Text>
      <Link as={NavLink} to={`/${auth.scope === 'all' ? 'matcha' : auth.scope}/`}>
        <Button mt={6} mb={3} variant='primary' size={buttonSize} leftIcon={<IoIosAddCircleOutline />}>
          Ajouter une entreprise
        </Button>
      </Link>
    </Flex>
  )
}
