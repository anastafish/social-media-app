import { Card, CardHeader, CardBody, CardFooter, Flex, Avatar, Box, Heading, IconButton, Text, Image, Button} from '@chakra-ui/react'


export default function Post({name, text}) {
    return (
        <Card maxW='md'>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />

        <Box>
          <Heading size='sm'>{name}</Heading>
          <Text>Creator, Chakra UI</Text>
        </Box>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
      />
    </Flex>
  </CardHeader>
  <CardBody>
    <Text>
      {text}
    </Text>
  </CardBody>
  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}
  >
    <Button flex='1' variant='ghost' >
      Like
    </Button>
    <Button flex='1' variant='ghost' >
      Comment
    </Button>
    <Button flex='1' variant='ghost' >
      Share
    </Button>
  </CardFooter>
</Card>
    )
  }