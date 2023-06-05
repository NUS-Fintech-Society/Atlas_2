import { ListItem, Text } from '@chakra-ui/react'
import type { QueryObserverResult } from '@tanstack/react-query'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import StatusPopup from './StatusPopup'

const AppliedRoleListItem = ({
  applicantId,
  appliedRole,
  refetch,
}: {
  applicantId: string
  appliedRole: AppliedRole
  refetch: () => Promise<QueryObserverResult>
}) => {
  return (
    <ListItem className="flex items-center justify-between">
      <Text fontWeight="medium">
        {appliedRole.rank}. {appliedRole.role}
      </Text>
      <StatusPopup
        applicantId={applicantId}
        status={appliedRole.status}
        appliedRoleId={appliedRole.id}
        refetch={refetch}
      />
    </ListItem>
  )
}

export default AppliedRoleListItem
