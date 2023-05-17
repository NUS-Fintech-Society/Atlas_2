import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { BsFileEarmark } from 'react-icons/bs'

const NoteModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <IconButton
        aria-label="Interview notes"
        icon={<BsFileEarmark />}
        bg="None"
        _hover={{ background: 'None' }}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          pb={4}
          backgroundColor="#F1F3FF"
          borderRadius="20px"
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        >
          <ModalHeader textAlign="center">Interview Notes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Notes on notes on notes</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NoteModal
