import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  ListIcon,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { Avatar } from 'flowbite-react'
import { BsCircleFill } from 'react-icons/bs'
import DocumentModal from './DocumentModal'
import EditModal from './EditModal'
import NoteModal from './NoteModal'

const ApplicantCard = () => {
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
      <CardBody className="relative">
        <Stack rowGap="3">
          <Avatar alt="User-settings" rounded={true} />
          <Box className="absolute top-8 left-0 flex w-full justify-between">
            <Box>
              <NoteModal />
              <DocumentModal />
            </Box>
            <EditModal />
          </Box>
          <UnorderedList styleType="none" spacing="2">
            <ListItem className="flex items-center justify-between">
              <Text>1. SD - Software Engineer</Text>
              <ListIcon as={BsCircleFill} marginLeft="2" fill="#46FFDE" />
            </ListItem>
            <ListItem className="flex items-center justify-between">
              <Text>2. ML - Role</Text>
              <ListIcon as={BsCircleFill} marginLeft="2" fill="#FFBD3C" />
            </ListItem>
            <ListItem className="flex items-center justify-between">
              <Text>3. IA - Director</Text>
              <ListIcon as={BsCircleFill} marginLeft="2" fill="#0038FF" />
            </ListItem>
          </UnorderedList>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default ApplicantCard
