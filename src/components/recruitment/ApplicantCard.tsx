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
import { Avatar } from 'flowbite-react'
import AppliedRoleListItem from './AppliedRoleListItem'
import DocumentModal from './DocumentModal'
import type { Applicant } from '~/server/db/models/Applicant'

const ApplicantCard = ({ applicant }: { applicant: Applicant }) => {
  return (
    <Card
      maxWidth="sm"
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
        boxSize="300px"
        position="absolute"
        height="85px"
      />
      <CardBody className="relative" pt="10px">
        <Stack>
          <Avatar alt="User-settings" rounded={true} size="lg" />
          <Box className="flex justify-center">
            <Box>
              <DocumentModal
                applicantId={applicant.id}
                applicantName={applicant.name}
              />
            </Box>
          </Box>
          <UnorderedList styleType="none">
            {applicant.appliedRoles
              .sort((a, b) => a.rank - b.rank)
              .map((appliedRole) => {
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
