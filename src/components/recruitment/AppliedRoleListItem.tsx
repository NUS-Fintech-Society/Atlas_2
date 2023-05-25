import { ListItem, Text } from '@chakra-ui/react'
import type { AppliedRole } from '@prisma/client'
import StatusPopup from './StatusPopup'

const AppliedRoleListItem = ({ appliedRole }: { appliedRole: AppliedRole }) => {
  return (
    <ListItem className="flex items-center justify-between">
      <Text>
        {appliedRole.rank}. {appliedRole.departmentId} - {appliedRole.role}
      </Text>
      <StatusPopup status={appliedRole.status} appliedRoleId={appliedRole.id} />
    </ListItem>
  )
}

export default AppliedRoleListItem
