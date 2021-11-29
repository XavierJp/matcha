import { Box, Heading, Text, Button, Stack } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

export default ({ title, subtitle, description, buttonLabel, bg, link, type }) => {
  const history = useHistory()
  return (
    <Box
      p={5}
      px={7}
      bg={bg}
      border='3px solid transparent'
      _hover={{ background: 'white', border: '3px solid #000091' }}
      flex='1'
    >
      <Stack direction='column' spacing='20px' py={10} align='flex-start'>
        <Heading color='bluefrance.500' fontSize='32px'>
          {title}
        </Heading>
        <Text fontWeight='700' fontSize='28px'>
          {subtitle}
        </Text>
        <Text>{description}</Text>
        <Button variant='primary' onClick={() => history.push(`${link}`, { type })}>
          {buttonLabel}
        </Button>
      </Stack>
    </Box>
  )
}
