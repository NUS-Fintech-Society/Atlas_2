import { useState } from 'react'
import { trpc } from '../../utils/trpc'
import { type QueryObserverResult } from '@tanstack/react-query'
import { BsDiscord, BsEnvelopeFill, BsTelegram } from 'react-icons/bs'
import { Box, useToast } from '@chakra-ui/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import EditProfileBtn from './EditProfileButton'
import SubmitEditBtn from './SubmitEditButton'
import DynamicInputField from './DynamicInputField'
import { Message } from '~/constant/messages'

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

        toast({
          duration: 3000,
          status: 'loading',
          title: 'Loading',
          description: Message.PERSONAL_INFO_LOADING,
        })

        await props.refetch()
        setEdit(false)

        toast({
          duration: 3000,
          status: 'success',
          title: 'Success',
          description: Message.PERSONAL_INFO_SUCCESS,
        })
      }
    } catch (e) {
      toast({
        duration: 3000,
        status: 'error',
        title: 'Oops, an error occured!',
        description: Message.PERSONAL_INFO_ERROR,
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

export default ProfileContactInfo
