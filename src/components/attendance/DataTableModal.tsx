import {
  ModalHeader,
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { EventModalContext } from '~/context/events/EventModalContext'

const DataTableModal = () => {
  const modal = useContext(EventModalContext)

  if (!modal.id) {
    return null
  }

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modal.id}</ModalHeader>
      </ModalContent>
    </Modal>
  )
}

export default DataTableModal
