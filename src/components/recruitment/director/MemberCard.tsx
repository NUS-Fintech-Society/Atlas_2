import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Avatar } from 'flowbite-react'
import DocumentModal from './DocumentModal'
import type { User } from '~/server/db/models/User'

const MemberCard = ({ member }: { member: User }) => {
  return (
    <Card
      maxWidth="xs"
      borderRadius="20"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
      minHeight="250px"
    >
      <CardHeader paddingBottom="0" zIndex={1}>
        <Heading size="md" textAlign="center" textColor="white">
          {member.name}
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
            name={member.name}
            resume={member.resume}
          />
          <Text className="text-center">{member.department.toUpperCase()}</Text>
          <Text>Role: {member.role} </Text>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default MemberCard
