import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'

export const AcceptRoleModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <button
        onClick={onOpen}
        className="rounded bg-green-500 px-4 font-bold text-white hover:bg-green-600"
      >
        Accept
      </button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xs"
        isCentered
        lockFocusAcrossFrames
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="1.5px" />
        <ModalContent>
          <ModalHeader fontSize="xl" className="font-[Inter]">
            <Text textAlign="center">Confirm Acceptance?</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="mx-8 flex justify-between font-[Inter]">
            <button
              onClick={() => {
                onClose()
                //TODO: Update status to accepted on backend
              }}
              className="text-l w-sm mt-5 rounded bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-600"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="text-l w-sm ml-10 mt-5 rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-600"
            >
              Cancel
            </button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const RejectRoleModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <button
        onClick={onOpen}
        className="ml-3 rounded bg-red-500 px-4 font-bold text-white hover:bg-red-600"
      >
        Reject
      </button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xs"
        isCentered
        lockFocusAcrossFrames
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="1.5px" />
        <ModalContent>
          <ModalHeader fontSize="xl" className="font-[Inter]">
            <Text textAlign="center">Confirm Rejection?</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="mx-8 flex justify-between font-[Inter]">
            <button
              onClick={() => {
                onClose()
                //TODO: Update status to rejected on backend
              }}
              className="text-l w-sm mt-5 rounded bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-600"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="text-l w-sm ml-10 mt-5 rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-600"
            >
              Cancel
            </button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
