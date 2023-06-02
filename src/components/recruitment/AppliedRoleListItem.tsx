import { Box, ListItem, Text } from '@chakra-ui/react'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import { trpc } from '~/utils/trpc'
import NoteModal from './NoteModal'
import StatusPopup from './StatusPopup'

const AppliedRoleListItem = ({ appliedRole }: { appliedRole: AppliedRole }) => {
  const { refetch } = trpc.recruitment.getAppliedRole.useQuery(appliedRole.id)
  return (
    <ListItem className="flex items-center justify-between">
      <Text>
        {appliedRole.rank}. {appliedRole.department} - {appliedRole.role}
      </Text>
      <Box>
        <StatusPopup
          status={appliedRole.status}
          appliedRoleId={appliedRole.id}
          refetch={refetch}
        />
        <NoteModal
          appliedRoleId={appliedRole.id}
          interviewNotes={appliedRole.interviewNotes}
          refetch={refetch}
        />
      </Box>
    </ListItem>
  )
}

export default AppliedRoleListItem
