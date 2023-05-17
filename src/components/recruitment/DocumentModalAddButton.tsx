import { AddIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'

const DocumentModalAddButton = () => {
  return (
    <IconButton
      aria-label="Info popup for applicant detail"
      icon={<AddIcon />}
      borderRadius="30px"
      boxShadow="0px 8px 4px 2px rgba(0, 0, 0, 0.15)"
      bg="white"
      _hover={{ background: '#e4e8ff' }}
      fontSize="40px"
      p="12"
      width="120px"
      height="120px"
    />
  )
}

export default DocumentModalAddButton
