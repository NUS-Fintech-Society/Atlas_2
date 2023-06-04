import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { Avatar } from 'flowbite-react'
import AppliedRoleListItem from './AppliedRoleListItem'
import DocumentModal from './DocumentModal'
import type { Applicant } from '~/server/db/models/Applicant'
import NoteModal from './NoteModal'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import { trpc } from '~/utils/trpc'

const ApplicantCard = ({ applicant }: { applicant: Applicant }) => {
  const appliedRole = applicant.appliedRoles[0] as AppliedRole
  const { refetch } = trpc.recruitment.getAppliedRole.useQuery(appliedRole.id)
  return (
    <Card
      maxWidth="xs"
      borderRadius="20"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    >
      <CardHeader paddingBottom="0" zIndex={1}>
        <Heading size="md" textAlign="center" textColor="white">
          {applicant.name}
        </Heading>
      </CardHeader>
      <Image
        src="/images/applicantcard_bg.svg"
        alt="blue wave background"
        borderTopLeftRadius="20"
        borderTopRightRadius="20"
        boxSize="500px"
        position="absolute"
        height="85px"
      />
      <CardBody className="relative" pt="10px">
        <Stack>
          <Avatar alt="User-settings" rounded={true} size="lg" />
          <DocumentModal
            applicantId={applicant.id}
            applicantName={applicant.name}
          />
          <NoteModal
            appliedRoleId={appliedRole.id}
            interviewNotes={appliedRole.interviewNotes}
            refetch={refetch}
          />
          <Text className="text-center">
            {appliedRole.department.toUpperCase()}
          </Text>
          <Text>Role Applied:</Text>
          <UnorderedList styleType="none">
            <AppliedRoleListItem
              appliedRole={appliedRole}
              key={appliedRole.id}
              refetch={refetch}
            />
          </UnorderedList>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default ApplicantCard
