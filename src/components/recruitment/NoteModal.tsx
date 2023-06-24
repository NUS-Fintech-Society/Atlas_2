import {
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BsFileEarmark } from 'react-icons/bs'
import { trpc } from '~/utils/trpc'
import { Message } from '~/constant/messages'
import type { QueryObserverResult } from '@tanstack/react-query'

const NoteModal = ({
  appliedRoleId,
  interviewNotes,
  refetch,
}: {
  appliedRoleId: string
  interviewNotes: string | undefined
  refetch: () => Promise<QueryObserverResult>
}) => {
  const toast = useToast()
  const { mutateAsync } = trpc.recruitment.updateInterviewNotes.useMutation()
  const [edit, setEdit] = useState(false)
  const [notes, setNotes] = useState(interviewNotes ? interviewNotes : '')
  const [tempNotes, setTempNotes] = useState(
    interviewNotes ? interviewNotes : ''
  )
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (interviewNotes) {
      setNotes(interviewNotes)
      setTempNotes(interviewNotes)
    }
  }, [interviewNotes])

  const resetNotes = () => {
    setTempNotes(notes)
    setEdit(false)
  }

  const updateNotes = async () => {
    await mutateAsync({
      interviewNotes: tempNotes,
      appliedRoleId: appliedRoleId,
    })

    toast({
      duration: 2000,
      status: 'loading',
      title: 'Loading',
      description: Message.APPLICANT_INFO_LOADING,
    })

    await refetch()
    setEdit(false)

    toast({
      duration: 2000,
      status: 'success',
      title: 'Success',
      description: Message.APPLICANT_INFO_SUCCESS,
    })
  }

  return (
    <Box className="absolute right-5 top-10">
      <IconButton
        aria-label="Interview notes"
        icon={<BsFileEarmark />}
        bg="None"
        _hover={{ background: 'None' }}
        onClick={onOpen}
        fontSize="20px"
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
          <ModalBody>
            <Input
              variant="unstyled"
              value={tempNotes || ''}
              onChange={(e) => {
                setTempNotes(e.currentTarget.value)
                setEdit(true)
              }}
            />
          </ModalBody>
          <ModalFooter>
            {edit ? (
              <>
                <Button mx="2" bg="#d3d3d3" onClick={resetNotes}>
                  Cancel
                </Button>
                <Button
                  bg="#97AEFF"
                  _hover={{ bg: '#adbfff' }}
                  onClick={updateNotes}
                >
                  Save
                </Button>
              </>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default NoteModal
