import { Box, HStack, ListItem, Text } from '@chakra-ui/react'
import type { Applicant } from '~/server/db/models/Applicant'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import { trpc } from '~/utils/trpc'
import NoteModal from './NoteModal'
import StatusPopup from './StatusPopup'

const ApplicantRoleListItem = ({
  applicant,
  appliedRole,
}: {
  applicant: Applicant
  appliedRole: AppliedRole
}) => {
  const { refetch } = trpc.recruitment.getAppliedRoleByRoleId.useQuery(
    appliedRole.id as string
  )
  return (
    <ListItem className="flex items-center justify-between">
      <Text fontWeight="medium">
        {appliedRole.rank}. {appliedRole.role}
      </Text>
      <Box display="flex" justifyContent="center" m={0} p={0}>
        <StatusPopup
          applicant={applicant}
          appliedRole={appliedRole}
          refetch={refetch}
        />
        <NoteModal
          appliedRoleId={appliedRole.id as string}
          interviewNotes={appliedRole.interviewNotes}
          refetch={refetch}
        />
      </Box>
    </ListItem>
  )
}

export default ApplicantRoleListItem
