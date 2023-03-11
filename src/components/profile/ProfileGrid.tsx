import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useRef,
  useState,
} from 'react'
import { trpc } from '../../utils/trpc'
import {
  BsDiscord,
  BsEnvelopeFill,
  BsTelegram,
  BsFillPencilFill,
  BsCheckLg,
} from 'react-icons/bs'
import { IconContext } from 'react-icons'
import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Stack,
  StackDivider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useToast,
} from '@chakra-ui/react'
import type { Session } from 'next-auth'
import type { Projects } from '@prisma/client'
import { useRouter } from 'next/router'

const defaultImage = '/fintech_logo.png'

const EditIcon = () => {
  return (
    <Box
      backgroundColor="#97AEFF"
      padding={1}
      borderRadius={5}
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    >
      <BsFillPencilFill />
    </Box>
  )
}

const ActiveEditIcon = () => {
  return (
    <Box
      backgroundColor="#445BAE"
      padding={1}
      borderRadius={5}
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    >
      <BsFillPencilFill fill="#F5F5F5" />
    </Box>
  )
}

const CheckIcon = () => {
  return (
    <Box
      backgroundColor="#97AEFF"
      padding={1}
      borderRadius={5}
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    >
      <BsCheckLg />
    </Box>
  )
}

// reference: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
const UploadImageBtn = ({
  setImage,
  studentId,
}: {
  setImage: Dispatch<SetStateAction<string>>
  studentId: string
}) => {
  const toast = useToast()
  // trigger a click event on the file input element when button is clicked
  const uploadRef = useRef<HTMLInputElement>(null)
  const { mutateAsync } = trpc.member.updateMemberImage.useMutation()
  const onUpload = () => {
    uploadRef.current?.click()
  }
  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const file = e.target.files.item(0)
      const reader = new FileReader()
      reader.addEventListener('load', async () => {
        try {
          const imageDataURI = reader.result as string
          const image = imageDataURI as string
          await mutateAsync({ studentId, image })
          toast({
            duration: 3000,
            description: 'Image successfully uploaded.',
            title: 'Success',
            status: 'success',
          })
          setImage(imageDataURI)
        } catch (e) {
          toast({
            duration: 3000,
            description: (e as Error).message,
            status: 'error',
            title: 'Something went wrong',
          })
        }
      })
      reader.readAsDataURL(file as Blob)
    }
  }
  return (
    <Button
      variant={'ghost'}
      size={'xs'}
      onClick={onUpload}
      _hover={{ bg: 'None' }}
    >
      <IconContext.Provider value={{ size: '20px' }}>
        <EditIcon />
      </IconContext.Provider>
      <input
        type={'file'}
        accept={'image/png, image/jpeg'}
        ref={uploadRef}
        onChange={handleFileSelected}
        className={'hidden'}
      />
    </Button>
  )
}

const EditProfileBtn = ({
  studentId,
  onEdit,
  edit,
}: {
  studentId: string | null
  onEdit: () => void
  edit: boolean
}) => {
  return (
    <Box className="absolute top-7 right-5">
      <Button
        variant={'ghost'}
        size={'xs'}
        onClick={onEdit}
        _hover={{ bg: 'None' }}
      >
        <IconContext.Provider value={{ size: '20px' }}>
          {edit ? <ActiveEditIcon /> : <EditIcon />}
        </IconContext.Provider>
      </Button>
    </Box>
  )
}

const SubmitEditBtn = () => {
  return (
    <Box className="absolute bottom-7 right-5">
      <Button
        variant={'ghost'}
        size={'xs'}
        _hover={{ bg: 'None' }}
        type="submit"
      >
        <IconContext.Provider value={{ size: '20px' }}>
          <CheckIcon />
        </IconContext.Provider>
      </Button>
    </Box>
  )
}

const ProfileGrid = ({
  studentId,
  session,
}: {
  studentId: string
  session: Session
}) => {
  // TRPC USEQUERY HOOK: SET REFETCH TO FALSE TO CACHE THE DATA
  const { data, isError } = trpc.member.getMemberProfile.useQuery(studentId, {
    refetchOnWindowFocus: false,
  })

  // IF THERE IS SOMETHING WRONG WITH FETCHING THE USER, THROW AN ERROR
  if (!data || !data.user || isError) {
    return <p className="text-3xl">Something is wrong</p>
  }

  return (
    <Grid className="m-2 mb-10 sm:m-10 sm:grid-cols-2">
      {/*TODO: fix responsiveness for ProfileCard */}
      <GridItem rowSpan={2} colSpan={1} className="lg:max-w-lg">
        <ProfileCard
          name={data.user.name}
          dept={data.user.department}
          role={data.user.roles}
          studentId={studentId}
          session={session}
        />
      </GridItem>
      <GridItem rowSpan={2} colSpan={1} className="lg:max-w-xl">
        <Stack divider={<StackDivider />} spacing="5">
          <ProfileContactInfo studentId={studentId} {...data.user} />
          <ProfileInfo {...data.user} />
        </Stack>
      </GridItem>
    </Grid>
  )
}

const ProfileCard = ({
  name,
  dept,
  role,
  studentId,
  session,
}: {
  name: string | null
  dept: string | null
  role: string | null
  studentId: string
  session: Session
}) => {
  const [image, setImage] = useState(defaultImage)
  const router = useRouter()
  const redirectToResetPassword = () => {
    router.push('/auth/forgetpassword')
  }
  trpc.member.getMemberImage.useQuery(studentId, {
    refetchOnWindowFocus: false,
    onSuccess(data) {
      if (!data || !data.image) return
      setImage(data.image)
    },
  })

  return (
    <Box className="mb-10 flex flex-col items-center">
      <Box className="relative">
        <Image
          alt="profile-pic"
          src={image}
          fallbackSrc={defaultImage}
          borderRadius="full"
          boxSize="170px"
        />
        {session?.user?.id === studentId ? (
          <Box className="absolute bottom-0 right-0">
            <UploadImageBtn setImage={setImage} studentId={studentId} />
          </Box>
        ) : null}
      </Box>
      <Box className="flex flex-col items-center py-2">
        <Text textColor="#01003D" className="text-2xl font-medium">
          {name}
        </Text>
        <Text textColor="#002D70">{dept}</Text>
        <Text textColor="#002D70">{role}</Text>
      </Box>
      <Button
        boxSizing="border-box"
        border="1px solid #01003D"
        className="mt-10 rounded-lg px-4 py-2"
        textColor="#01003D"
        variant="ghost"
        _hover={{ bg: '#97AEFF' }}
        onClick={redirectToResetPassword}
      >
        Reset Password
      </Button>
    </Box>
  )
}

const ProfileContactInfo = (props: {
  studentId: string | null
  telegram: string | null
  discord: string | null
  personal_email: string | null
  email: string
}) => {
  // mutateAsync for editInfo

  // Form validation logic

  // onClick need show the tick button
  const [edit, setEdit] = useState(false)
  const onEdit = () => {
    setEdit(!edit)
  }

  // onClick tick button need to hide tick button
  return (
    <Box className="relative">
      <EditProfileBtn studentId={props.studentId} onEdit={onEdit} edit={edit} />
      <Box
        backgroundColor="#F7FCFF"
        borderRadius="55px"
        boxShadow="0px 3px 3px rgba(0, 0, 0, 0.2)"
        className="flex flex-col gap-3 py-6 px-10"
      >
        <Box className="flex items-center gap-1">
          <BsTelegram size="20px" className="fill-[#0088cc]" />
          <Text textColor="#01003D" className="text-base font-extralight">
            {props.telegram}
          </Text>
        </Box>
        <Box className="flex items-center gap-1">
          <BsDiscord size="20px" className="fill-[#5865F2]" />
          <Text textColor="#01003D" className="text-base font-extralight">
            {props.discord}
          </Text>
        </Box>
        <Box className="flex items-center gap-1">
          <BsEnvelopeFill size="20px" className="fill-[#54CCFF]" />
          <Text textColor="#01003D" className="text-base font-extralight">
            {props.personal_email}
          </Text>
        </Box>
        <Box className="flex items-center gap-1">
          <BsEnvelopeFill size="20px" className="fill-[#97AEFF]" />
          <Text textColor="#01003D" className="text-base font-extralight">
            {props.email}
          </Text>
        </Box>
      </Box>
      {edit && <SubmitEditBtn />}
    </Box>
  )
}

const ProfileInfo = (props: ProfilePageType) => {
  return (
    <Box
      backgroundColor="rgba(242, 235, 255, 0.58)"
      borderRadius="55px"
      padding={10}
    >
      <TableContainer>
        <Table variant="unstyled" size="sm">
          <Tbody>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                GENDER
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.gender}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                BATCH
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.batch}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                YEAR
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.year}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                FACULTY
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.faculty}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                MAJOR
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.major}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                PROJECTS
              </Td>
              {props.projects.map((project) => {
                return (
                  <Td
                    key={project.project_id}
                    textColor="#002D70"
                    className="font-light"
                  >
                    {project.name}
                  </Td>
                )
              })}
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

type ProfilePageType = {
  gender: string | null
  batch: string | null
  year: string | null
  faculty: string | null
  major: string | null
  projects: Projects[]
}

export default ProfileGrid
