import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import CreateMultipleApplicants from './CreateMultipleApplicants'

const CreateApplicantsModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box>
      <Button
        bgColor="#97AEFF"
        width={230}
        className="text-black"
        onClick={onOpen}
      >
        Create Applicants
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          pb={5}
          backgroundColor="#F1F3FF"
          borderRadius="20px"
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        >
          <ModalHeader textAlign="center" fontSize="2xl">
            Upload CSV
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex justify-center">
            <CreateMultipleApplicants />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default CreateApplicantsModal
