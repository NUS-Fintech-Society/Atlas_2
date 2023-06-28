import {
  Card,
  CardBody,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { BsCircleFill } from 'react-icons/bs'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import { AcceptRoleModal, RejectRoleModal } from './AcceptRejectRoleModal'

const statusFillMap = {
  [ApplicationStatus.ACCEPTED]: '#46FFDE',
  [ApplicationStatus.OFFERED]: '#0038FF',
  [ApplicationStatus.PENDING]: '#FFBD3C',
  [ApplicationStatus.INTERVIEWED]: '#CE44FF',
  [ApplicationStatus.REJECTED]: '#FF0000',
}

const ApplicationStatusListItem = ({
  appliedRole,
}: {
  appliedRole: AppliedRole
}) => {
  return (
    <Card key={appliedRole.id} bgColor="transparent">
      <CardBody>
        <Stack>
          <HStack className="flex justify-between">
            <Text className="text-2xl">{appliedRole.role}</Text>
            {appliedRole.status === ApplicationStatus.OFFERED ? (
              <Stack direction={['column', 'row']}>
                <AcceptRoleModal />
                <RejectRoleModal />
              </Stack>
            ) : (
              <></>
            )}
          </HStack>
          <HStack className="flex justify-between">
            <Text className="text-l">{appliedRole.department}</Text>
            <IconButton
              aria-label="status"
              icon={<BsCircleFill fill={statusFillMap[appliedRole.status]} />}
              bg="None"
              pointerEvents="none"
              _hover={{ background: 'None' }}
            />
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default ApplicationStatusListItem
