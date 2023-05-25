import {
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
  applicantId,
  interviewNotes,
  refetch,
}: {
  applicantId: string
  interviewNotes: string | null
  refetch: () => Promise<QueryObserverResult>
}) => {
  interviewNotes = 'hello there testing'

  const toast = useToast()
  const { mutateAsync } = trpc.recruitment.updateInterviewNotes.useMutation()
  const [edit, setEdit] = useState(false)
  const [notes, setNotes] = useState('default notes')
  const [tempNotes, setTempNotes] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  //TODO: checking inputs
  useEffect(() => {
    console.log('notes:', notes)
    console.log('temp notes:', tempNotes)
  })
  //TODO: checking inputs
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
      applicantId: applicantId,
    })

    toast({
      duration: 3000,
      status: 'loading',
      title: 'Loading',
      description: Message.PERSONAL_INFO_LOADING,
    })

    await refetch()
    setEdit(false)

    toast({
      duration: 3000,
      status: 'success',
      title: 'Success',
      description: Message.PERSONAL_INFO_SUCCESS,
    })
  }

  return (
    <>
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
            {tempNotes ? (
              <Input
                variant="unstyled"
                value={tempNotes}
                onChange={(e) => {
                  setTempNotes(e.currentTarget.value)
                  setEdit(true)
                }}
              />
            ) : (
              <Input
                variant="unstyled"
                placeholder="Write notes.."
                onChange={(e) => {
                  setTempNotes(e.currentTarget.value)
                  setEdit(true)
                }}
              />
            )}
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
    </>
  )
}

export default NoteModal
