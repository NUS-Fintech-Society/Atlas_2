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
import { BsFolder2Open } from 'react-icons/bs'
import DocumentModalAddButton from './DocumentModalAddButton'
import DocumentModalCard from './DocumentModalCard'

const DocumentModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <IconButton
        aria-label="Upload documents"
        icon={<BsFolder2Open />}
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
          <ModalHeader textAlign="center" fontSize="2xl">
            [Username] Documents
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="my-5 mx-10 grid grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2 ">
              <DocumentModalCard />
              <DocumentModalCard />
              <DocumentModalAddButton />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DocumentModal
