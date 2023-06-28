import { ListItem, Text } from '@chakra-ui/react'
import type { QueryObserverResult } from '@tanstack/react-query'
import type { Applicant } from '~/server/db/models/Applicant'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import StatusPopup from './StatusPopup'

const ApplicantRoleListItem = ({
  applicant,
  appliedRole,
  refetch,
}: {
  applicant: Applicant
  appliedRole: AppliedRole
  refetch: () => Promise<QueryObserverResult>
}) => {
  return (
    <ListItem className="flex items-center justify-between">
      <Text fontWeight="medium">
        {appliedRole.rank}. {appliedRole.role}
      </Text>
      <StatusPopup
        applicant={applicant}
        appliedRole={appliedRole}
        refetch={refetch}
      />
    </ListItem>
  )
}

export default ApplicantRoleListItem
