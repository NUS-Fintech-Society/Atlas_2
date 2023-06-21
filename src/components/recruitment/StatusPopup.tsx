import {
  IconButton,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  UnorderedList,
  useToast,
} from '@chakra-ui/react'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import type { QueryObserverResult } from '@tanstack/react-query'
import { BsCircleFill } from 'react-icons/bs'
import { trpc } from '~/utils/trpc'
import Router from 'next/router'
import { useState } from 'react'
import type { Applicant } from '~/server/db/models/Applicant'
import type { AppliedRole } from '~/server/db/models/AppliedRole'


const statusFillMap = {
  [ApplicationStatus.ACCEPTED]: '#46FFDE',
  [ApplicationStatus.OFFERED]: '#0038FF',
  [ApplicationStatus.PENDING]: '#FFBD3C',
  [ApplicationStatus.INTERVIEWED]: '#CE44FF',
  [ApplicationStatus.REJECTED]: '#FF0000',
}

const StatusPopup = ({
  applicant,
  appliedRole,
  refetch,
}: {
  applicant: Applicant
  appliedRole: AppliedRole
  refetch: () => Promise<QueryObserverResult>
}) => {
  const toast = useToast()
  const { mutateAsync } = trpc.recruitment.updateAppliedRoleStatus.useMutation()
  const [currentStatus, setCurrentStatus] = useState(appliedRole.status);
  const [statusInModal, setStatusInModal] = useState(appliedRole.status)
  const [isAcceptOpen, setIsAcceptOpen] = useState(false)
  // const onOpenAccept = () => setIsAcceptOpen(true)
  const onCloseAccept = (inputStatus: ApplicationStatus) => {
    setIsAcceptOpen(false)
    updateStatus(inputStatus as ApplicationStatus)
  }
  const updateStatus = async (status: ApplicationStatus) => {
    try {
    
      const firstToast = toast({
        duration: null,
        status: 'loading',
        title: 'Updating',
        description: 'Waiting to update...'
     
      });
      await mutateAsync({
        status: status,
        appliedRoleId: appliedRole.id,
        name: applicant.name,
        email: applicant.email,
        appliedRole: appliedRole.role,
        appliedDepartment: appliedRole.department,
      })
      await refetch()
      setCurrentStatus(status);
      toast.close(firstToast)
      toast({
        duration: 2000,
        status: 'success',
        title: 'Success',
        description: 'Application status updated successfully!',
      })
     

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
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="status"

          icon={<BsCircleFill fill={statusFillMap[currentStatus]} />}

          bg="None"
          _hover={{ background: 'None' }}
        ></IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverBody>
          <UnorderedList styleType="none">
            <ListItem className="flex items-center">
              <IconButton
                aria-label="accepted status"
                icon={<BsCircleFill fill="#46FFDE" />}
                bg="None"
                _hover={{ background: 'None' }}
                marginLeft="2"
                onClick={() => {
                  setIsAcceptOpen(true)
                  setStatusInModal(ApplicationStatus.ACCEPTED as ApplicationStatus)
               
                }
                }
              />
              <Text>Accepted</Text>
            </ListItem>
            <ListItem className="flex items-center">
              <IconButton
                aria-label="offered status"
                icon={<BsCircleFill fill="#0038FF" />}
                bg="None"
                _hover={{ background: 'None' }}
                marginLeft="2"
                onClick={() => {
                  setIsAcceptOpen(true)
                  setStatusInModal(ApplicationStatus.OFFERED as ApplicationStatus)
                 
                }
                }
              />
              <Text>Offered</Text>
            </ListItem>
            <ListItem className="flex items-center">
              <IconButton
                aria-label="pending review status"
                icon={<BsCircleFill fill="#FFBD3C" />}
                bg="None"
                _hover={{ background: 'None' }}
                marginLeft="2"
                onClick={() => {
                  setIsAcceptOpen(true)
                  setStatusInModal(ApplicationStatus.PENDING as ApplicationStatus)
                 
                }
                }
              />
              <Text>Pending Review</Text>
            </ListItem>
            <ListItem className="flex items-center">
              <IconButton
                aria-label="interviewed status"
                icon={<BsCircleFill fill="#CE44FF" />}
                bg="None"
                _hover={{ background: 'None' }}
                marginLeft="2"
                onClick={() => {
                  setIsAcceptOpen(true)
                  setStatusInModal(ApplicationStatus.INTERVIEWED as ApplicationStatus)
                 
                  }
                }
              />
              <Text>Interviewed</Text>
            </ListItem>
            <ListItem className="flex items-center">
              <IconButton
                aria-label="rejected status"
                icon={<BsCircleFill fill="#FF0000" />}
                bg="None"
                _hover={{ background: 'None' }}
                marginLeft="2"
                onClick={() => {
                  setIsAcceptOpen(true)
                  setStatusInModal(ApplicationStatus.REJECTED as ApplicationStatus)
            
                }
                }
              />
              <Text>Rejected</Text>
            </ListItem>
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>

      <Modal
          isOpen={isAcceptOpen}
          onClose={() => setIsAcceptOpen(false)}
          size="xs"
        >
          <ModalOverlay bg="none" backdropFilter="auto" />
          <ModalContent>
            <ModalHeader fontSize="5xl"></ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize="2xl ">
              <div className=" flex-col justify-center">
                <div className="items-center">
                  Confirm Status Update?
                  <button
                    onClick={() => {
                      onCloseAccept(statusInModal)
                    }}
                    className="mt-5 rounded bg-green-500 py-2 px-4 text-2xl font-bold text-white hover:bg-green-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setIsAcceptOpen(false)
                    }}
                    className="ml-10 mt-5 rounded bg-red-500 py-2 px-4 text-2xl font-bold text-white hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
    </Popover>
  )
}

export default StatusPopup
