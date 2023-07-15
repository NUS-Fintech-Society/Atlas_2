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
  useToast,
} from '@chakra-ui/react'
import type { QueryObserverResult } from '@tanstack/react-query'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import { trpc } from '~/utils/trpc'
import { delay } from '~/utils/common'
import { useRouter } from 'next/router'

const AcceptRejectRoleModal = ({
  applicantId,
  appliedRole,
  decision,
  buttonColor,
  refetch,
}: {
  applicantId: string
  appliedRole: AppliedRole
  decision: string
  buttonColor: string
  refetch: () => Promise<QueryObserverResult>
}) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutateAsync: mutateAppliedRoleAsync } =
    trpc.recruitment.updateAppliedRoleStatus.useMutation()

  const toast = useToast()
  const updateStatus = async () => {
    try {
      const status =
        decision === 'accept'
          ? ApplicationStatus.ACCEPTED
          : ApplicationStatus.REJECTED
  
      // Update the appliedRole and the user information
      await mutateAppliedRoleAsync({
        status: status,
        appliedRoleId: appliedRole.id,
        applicantId
      })

      await refetch()
      toast({
        duration: 2000,
        status: 'success',
        title: 'Success',
        description: 'Application status updated successfully!',
      })
      await delay(1000)
      // Applicant -> Member with accepted role + dept if applicant accepts
      if (status === ApplicationStatus.ACCEPTED) {
        toast({
          duration: 2000,
          status: 'success',
          title: 'Update Info',
          description: `You are now a member! You'll be redirected shortly to update your information`,
        })
        await delay(3000)
        router.push('/update-info')
      }
    } catch (e) {
      toast({
        description: (e as Error).message,
        duration: 2000,
        status: 'error',
        title: 'Oops, an error occurred!',
      })
    }
  }
  return (
    <>
      <button
        onClick={onOpen}
        className={`rounded bg-${buttonColor}-500 px-4 font-bold text-white hover:bg-${buttonColor}-600`}
      >
        {decision === 'accept' ? 'Accept' : 'Reject'}
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
            <Text textAlign="center">
              Confirm {decision === 'accept' ? 'Acceptance' : 'Rejection'}?
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="mx-8 flex justify-between font-[Inter]">
            <button
              onClick={() => {
                updateStatus()
                onClose()
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

export default AcceptRejectRoleModal
