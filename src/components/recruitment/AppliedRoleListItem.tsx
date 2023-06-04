import { Box, ListItem, Text } from '@chakra-ui/react'
import type { QueryObserverResult } from '@tanstack/react-query'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import StatusPopup from './StatusPopup'

const AppliedRoleListItem = ({
  appliedRole,
  refetch,
}: {
  appliedRole: AppliedRole
  refetch: () => Promise<QueryObserverResult>
}) => {
  return (
    <ListItem className="flex items-center justify-between">
      <Text>
        {appliedRole.rank}. {appliedRole.role}
      </Text>
      <StatusPopup
        status={appliedRole.status}
        appliedRoleId={appliedRole.id}
        refetch={refetch}
      />
    </ListItem>
  )
}

export default AppliedRoleListItem
