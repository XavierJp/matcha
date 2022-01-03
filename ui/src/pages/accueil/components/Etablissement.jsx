import { Box, Heading, Text, Button, Stack, Flex } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

export default ({ title, subtitle, description, buttonLabel, bg, link, type, buttonLabel2, link2 }) => {
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
      <Stack direction='column' spacing='20px' py={10}>
        <Heading color='bluefrance.500' fontSize='32px'>
          {title}
        </Heading>
        <Text fontWeight='700' fontSize='28px'>
          {subtitle}
        </Text>
        <Text>{description}</Text>
        <Flex>
          <Button variant='primary' onClick={() => history.push(`${link}`, { type })} mr={5}>
            {buttonLabel}
          </Button>
          {buttonLabel2 && (
            <Button variant='secondary' onClick={() => history.push(`${link2}`)}>
              {buttonLabel2}
            </Button>
          )}
        </Flex>
      </Stack>
    </Box>
  )
}