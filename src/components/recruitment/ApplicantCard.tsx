import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Stack,
  UnorderedList,
} from '@chakra-ui/react'
import { User } from '@prisma/client'
import { Avatar } from 'flowbite-react'
import AppliedRoleListItem from './AppliedRoleListItem'
import DocumentModal from './DocumentModal'
import NoteModal from './NoteModal'
import type { AppliedRole } from '@prisma/client'
import { trpc } from '~/utils/trpc'
import { ApplicantWithAppliedRole } from '~/types/model'

const ApplicantCard = ({
  applicant,
}: {
  applicant: ApplicantWithAppliedRole
}) => {
  const { refetch } = trpc.recruitment.getApplicant.useQuery(applicant.id)
  return (
    <Card
      maxWidth="sm"
      borderRadius="20"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    >
      <CardHeader paddingBottom="0" zIndex={1}>
        <Heading size="md" textAlign="center" textColor="white">
          Name
        </Heading>
      </CardHeader>
      <Image
        src="/images/applicantcard_bg.svg"
        alt="blue wave background"
        borderTopLeftRadius="20"
        borderTopRightRadius="20"
        boxSize="300px"
        position="absolute"
        height="85px"
      />
      <CardBody className="relative" pt="10px">
        <Stack>
          <Avatar alt="User-settings" rounded={true} size="lg" />
          <Box className="flex justify-center">
            <Box>
              <DocumentModal />
              <NoteModal
                applicantId={applicant.id}
                interviewNotes={applicant.interviewNotes}
                refetch={refetch}
              />
            </Box>
          </Box>
          <UnorderedList styleType="none">
            {applicant.appliedRoles.map((appliedRole) => {
              return (
                <AppliedRoleListItem
                  appliedRole={appliedRole}
                  key={appliedRole.id}
                />
              )
            })}
          </UnorderedList>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default ApplicantCard
