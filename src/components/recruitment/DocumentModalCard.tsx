import { Card, CardBody, IconButton, Text } from '@chakra-ui/react'

const DocumentModalCard = ({ file }: { file: string }) => {
  const openDocumentInNewTab = () => {
    window.open(file, '_blank', 'noreferrer')
  }
  return (
    <IconButton
      aria-label={file}
      borderRadius="30px"
      boxShadow="0px 8px 4px 2px rgba(0, 0, 0, 0.15)"
      bg="white"
      _hover={{ background: '#e4e8ff' }}
      width="120px"
      height="120px"
      onClick={() => openDocumentInNewTab()}
    >
      <CardBody>
        <Text textAlign="center">Document</Text>
      </CardBody>
    </IconButton>
  )
}

export default DocumentModalCard
