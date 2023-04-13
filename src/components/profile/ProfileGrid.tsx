import { useState } from 'react'
import { trpc } from '../../utils/trpc'
import { type QueryObserverResult } from '@tanstack/react-query'
import { BsDiscord, BsEnvelopeFill, BsTelegram } from 'react-icons/bs'
import { Box, Input, Text, useToast } from '@chakra-ui/react'
import type { Session } from 'next-auth'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import LoadingScreen from '../common/LoadingScreen'
import EditProfileBtn from './EditProfileButton'
import SubmitEditBtn from './SubmitEditButton'
import ProfileCard from './ProfileCard'
import ProfileInfo from './ProfileInfo'

const ProfileGrid = ({
  studentId,
  session,
}: {
  studentId: string
  session: Session
}) => {
  // TRPC USEQUERY HOOK: SET REFETCH TO FALSE TO CACHE THE DATA
  const { data, isError, isLoading, refetch } =
    trpc.member.getMemberProfile.useQuery(studentId)

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
        <ProfileContactInfo
          studentId={studentId}
          {...data.user}
          refetch={refetch}
        />
      </div>
      <div className="col-span-2 row-span-2 mb-10 w-3/4">
        <ProfileInfo {...data.user} />
      </div>
    </div>
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
  refetch: () => Promise<QueryObserverResult>
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

        await props.refetch()
        setEdit(false)

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

export default ProfileGrid
