import { useState } from 'react'
import { trpc } from '../../utils/trpc'
import { BsDiscord, BsEnvelopeFill, BsTelegram } from 'react-icons/bs'
import { IconContext } from 'react-icons'
import {
  Box,
  Button,
  Image,
  Input,
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
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import LoadingScreen from '../common/LoadingScreen'
import EditIcon from './EditIcon'
import CheckIcon from './CheckIcon'
import UploadImageBtn from './UploadImageButton'

const defaultImage = '/fintech_logo.png'

const EditProfileBtn = ({
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
          <EditIcon active={edit} />
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
  const { data, isError, isLoading } = trpc.member.getMemberProfile.useQuery(
    studentId,
    {
      refetchOnWindowFocus: false,
    }
  )

  if (isLoading) {
    return <LoadingScreen />
  }

  // IF THERE IS SOMETHING WRONG WITH FETCHING THE USER, THROW AN ERROR
  if (!data || !data.user || isError) {
    return <p className="text-3xl">Something is wrong</p>
  }

  return (
    <div className="m-10 grid grid-cols-1 grid-rows-3 place-items-center gap-y-6 md:grid-cols-3">
      <div className="row-span-3 h-full w-3/4 max-w-md bg-[#01003D] md:place-self-end">
        <ProfileCard
          name={data.user.name}
          dept={data.user.department}
          role={data.user.roles}
          studentId={studentId}
          session={session}
        />
      </div>
      <div className="col-span-2 w-3/4">
        <ProfileContactInfo studentId={studentId} {...data.user} />
      </div>
      <div className="col-span-2 row-span-2 mb-10 w-3/4">
        <ProfileInfo {...data.user} />
      </div>
    </div>
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
  const router = useRouter()
  const redirectToResetPassword = () => router.push('/auth/forgetpassword')

  const { isLoading, data } = trpc.member.getMemberImage.useQuery(studentId)

  return (
    <Box className="mb-10 flex flex-col items-center">
      <Box className="relative">
        <Image
          alt="profile-pic"
          src={isLoading || !data || !data.image ? defaultImage : data.image}
          fallbackSrc={defaultImage}
          objectFit="cover"
          borderRadius="full"
          boxSize="170px"
        />
        {session?.user?.id === studentId ? (
          <Box className="absolute bottom-0 right-0">
            <UploadImageBtn studentId={studentId} />
          </Box>
        ) : null}
      </Box>
      <Box className="flex flex-col items-center py-2">
        <Text textColor="##FFFFFF" className="text-2xl font-medium">
          {name}
        </Text>
        <Text textColor="##FFFFFF">{dept}</Text>
        <Text textColor="#FFFFFF">{role}</Text>
      </Box>
      <Button
        boxSizing="border-box"
        border="1px solid #FFFFFF"
        className="mt-10 rounded-lg px-4 py-2"
        textColor="#FFFFFF"
        variant="ghost"
        _hover={{ bg: '#97AEFF' }}
        onClick={redirectToResetPassword}
      >
        Reset Password
      </Button>
    </Box>
  )
}

const DynamicInputField = ({
  edit,
  isSubmitting,
  register,
  field,
  fieldValue,
}: {
  edit: boolean
  isSubmitting: boolean
  register: any
  field: string
  fieldValue: string | null
}) => {
  return (
    <>
      {edit ? (
        <Input
          size="xs"
          variant="flushed"
          htmlSize={26}
          width="auto"
          textColor="#01003D"
          className="font-extralight"
          fontSize="l"
          type="text"
          disabled={isSubmitting}
          {...register(field)}
        />
      ) : (
        <Text textColor="#01003D" className="text-base font-extralight">
          {fieldValue}
        </Text>
      )}
    </>
  )
}

const ProfileContactInfo = (props: {
  studentId: string | null
  telegram: string | null
  discord: string | null
  personal_email: string | null
  email: string
}) => {
  const toast = useToast()
  const { isLoading: isSubmitting, mutateAsync } =
    trpc.member.updateMemberContacts.useMutation()

  const [edit, setEdit] = useState(false)
  const onEdit = () => {
    setEdit(!edit)
  }

  // Form validation logic
  const preloadedValues = {
    telegram: props.telegram ? props.telegram : '',
    discord: props.discord ? props.discord : '',
    personal_email: props.personal_email ? props.personal_email : '',
    email: props.email ? props.email : '',
  }

  const FormSchema = z.object({
    telegram: z.string(),
    discord: z.string(),
    personal_email: z.string().email(),
    email: z.string().email(),
  })

  type FormSchemaType = z.infer<typeof FormSchema>

  const { register, handleSubmit } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  })

  const formSubmit = async (formData: FormSchemaType) => {
    try {
      if (props.studentId) {
        await mutateAsync({
          studentId: props.studentId,
          telegram: formData.telegram,
          discord: formData.discord,
          personal_email: formData.personal_email,
          email: formData.email,
        })

        toast({
          duration: 3000,
          status: 'success',
          title: 'Success',
          description: 'Your contact details have been updated!',
        })
      }
    } catch (e) {
      toast({
        duration: 3000,
        status: 'error',
        title: 'Oops, an error occured!',
        description: (e as Error).message,
      })
    }
  }

  return (
    <Box className="relative">
      <EditProfileBtn studentId={props.studentId} onEdit={onEdit} edit={edit} />
      <form onSubmit={handleSubmit(formSubmit)}>
        <Box
          backgroundColor="#F7FCFF"
          borderRadius="55px"
          boxShadow="0px 3px 3px rgba(0, 0, 0, 0.2)"
          className="flex flex-col gap-3 py-6 px-10"
        >
          <Box className="flex items-center gap-1">
            <BsTelegram size="20px" className="fill-[#0088cc]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="telegram"
              fieldValue={props.telegram}
            />
          </Box>
          <Box className="flex items-center gap-1">
            <BsDiscord size="20px" className="fill-[#5865F2]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="discord"
              fieldValue={props.discord}
            />
          </Box>
          <Box className="flex items-center gap-1">
            <BsEnvelopeFill size="20px" className="fill-[#54CCFF]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="personal_email"
              fieldValue={props.personal_email}
            />
          </Box>
          <Box className="flex items-center gap-1">
            <BsEnvelopeFill size="20px" className="fill-[#97AEFF]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="email"
              fieldValue={props.email}
            />
          </Box>
        </Box>
        {edit && <SubmitEditBtn />}
      </form>
    </Box>
  )
}

const ProfileInfo = (props: ProfilePageType) => {
  return (
    <Box
      backgroundColor="rgba(242, 235, 255, 0.58)"
      borderRadius="55px"
      padding={10}
      className="h-full"
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
