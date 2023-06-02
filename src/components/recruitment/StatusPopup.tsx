import {
  IconButton,
  ListItem,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  UnorderedList,
  useToast,
} from '@chakra-ui/react'
import { ApplicationStatus } from '~/constant/applicationStatus'
import type { QueryObserverResult } from '@tanstack/react-query'
import { BsCircleFill } from 'react-icons/bs'
import { trpc } from '~/utils/trpc'

const statusFillMap = {
  [ApplicationStatus.ACCEPTED]: '#46FFDE',
  [ApplicationStatus.OFFERED]: '#0038FF',
  [ApplicationStatus.PENDING]: '#FFBD3C',
  [ApplicationStatus.INTERVIEWED]: '#CE44FF',
  [ApplicationStatus.REJECTED]: '#FF0000',
}

const StatusPopup = ({
  status,
  appliedRoleId,
  refetch,
}: {
  appliedRoleId: string
  status: ApplicationStatus
  refetch: () => Promise<QueryObserverResult>
}) => {
  const toast = useToast()
  const { mutateAsync } = trpc.recruitment.updateAppliedRoleStatus.useMutation()
  const updateStatus = async (status: ApplicationStatus) => {
    try {
      await mutateAsync({
        status: status,
        appliedRoleId: appliedRoleId,
      })
      await refetch()
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
          icon={<BsCircleFill fill={statusFillMap[status]} />}
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
                onClick={() =>
                  updateStatus(ApplicationStatus.ACCEPTED as ApplicationStatus)
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
                onClick={() =>
                  updateStatus(ApplicationStatus.OFFERED as ApplicationStatus)
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
                onClick={() =>
                  updateStatus(ApplicationStatus.PENDING as ApplicationStatus)
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
                onClick={() =>
                  updateStatus(
                    ApplicationStatus.INTERVIEWED as ApplicationStatus
                  )
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
                onClick={() =>
                  updateStatus(ApplicationStatus.REJECTED as ApplicationStatus)
                }
              />
              <Text>Rejected</Text>
            </ListItem>
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default StatusPopup
