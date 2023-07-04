import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Stack,
  Text,
  UnorderedList,
  useToast,
} from '@chakra-ui/react'
import { Avatar } from 'flowbite-react'
import AppliedRoleListItem from './ApplicantRoleListItem'
import DocumentModal from './DocumentModal'
import type { Applicant } from '~/server/db/models/Applicant'
import NoteModal from './NoteModal'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import { trpc } from '~/utils/trpc'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useState } from 'react'

const ApplicantCard = ({ applicant }: { applicant: Applicant }) => {
  const appliedRoles = applicant.appliedRoles
  const [isFlagged, setIsFlagged] = useState(appliedRoles.length > 1 ? ((appliedRoles[0]?.flag && 
    appliedRoles[1]?.flag) ? true : false) :  appliedRoles[0]?.flag)
  const appliedRoleId = appliedRoles.length > 1 ? [appliedRoles[0]?.id, appliedRoles[1]?.id] : 
  [appliedRoles[0]?.id]
  // const { refetch } = trpc.recruitment.getAppliedRoleByRoleId.useQuery(
  //   appliedRoleId[0] ? appliedRoleId[0] : ""
  // )
   
  const toast = useToast()
  const { mutateAsync } = trpc.recruitment.updateAppliedRoleFlag.useMutation()
  const updateFlag = async (flag: boolean) => {
    try {
      const firstToast = toast({
        duration: null,
        status: 'loading',
        title: 'Updating',
        description: 'Waiting to update...',
      })
      await mutateAsync({
        flag: flag,
        appliedRoleId: appliedRoleId[0] ? appliedRoleId[0] : ""
      })
      if (appliedRoleId.length > 1) {
        await mutateAsync({
          flag: flag,
          appliedRoleId: appliedRoleId[1] ? appliedRoleId[1] : "",
        })
      }
      // await refetch()
      setIsFlagged(flag)
      toast.close(firstToast)
      toast({
        duration: 2000,
        status: 'success',
        title: 'Success',
        description: "Applicant's flag updated successfully!",
      })
    } catch (e) {
      toast({
        description: (e as Error).message,
        duration: 2000,
        status: 'error',
        title: 'Oops, an error occurred!',
      })
    }
  }
  return (
    <Card
      maxWidth="xs"
      borderRadius="20"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
      minHeight="310px"
    >
      <CardHeader paddingBottom="0" zIndex={1}>
        <Heading size="md" textAlign="center" textColor="white">
          {isFlagged ? (
            <button
              className="absolute left-2"
              onClick={() => {
                updateFlag(false)
              }}
            >
              <ViewIcon></ViewIcon>
            </button>
          ) : (
            <button
              className="absolute left-2"
              onClick={() => {
                updateFlag(true)
              }}
            >
              <ViewOffIcon></ViewOffIcon>
            </button>
          )}

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
        height="95px"
      />
      <CardBody className="relative" pt="10px">
        <Stack>
          <Avatar alt="User-settings" rounded={true} size="lg" />
          <DocumentModal
            applicantId={applicant.id}
            applicantName={applicant.name}
            applicantResume={applicant.resume}
          />
          <Text className="text-center">
            {appliedRoles[0]?.department.toUpperCase()}
          </Text>
          <Text>Role Applied:</Text>
          <UnorderedList styleType="none">
            {appliedRoles?.map((appliedRole) => {
              return (
                <AppliedRoleListItem
                  applicant={applicant}
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
