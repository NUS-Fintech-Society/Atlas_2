import { Card, CardBody, Text } from '@chakra-ui/react'

const DocumentModalCard = () => {
  return (
    <Card
      borderRadius="30px"
      boxShadow="0px 8px 4px 2px rgba(0, 0, 0, 0.15)"
      width="120px"
      height="120px"
    >
      <CardBody>
        <Text textAlign="center">Transcript</Text>
      </CardBody>
    </Card>
  )
}

export default DocumentModalCard
