import { useState, useCallback } from 'react'
import { trpc } from '../../utils/trpc'
import { type QueryObserverResult } from '@tanstack/react-query'
import {
  BsEnvelopeFill,
  BsTelegram,
  BsDiscord,
  BsLinkedin,
} from 'react-icons/bs'
import { FaTshirt } from 'react-icons/fa'
import { MdFastfood } from 'react-icons/md'
import { Box, useToast } from '@chakra-ui/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import EditProfileBtn from './EditProfileButton'
import SubmitEditBtn from './SubmitEditButton'
import DynamicInputField from './DynamicInputField'
import { Message } from '~/constant/messages'
import type { User } from '~/server/db/models/User'

const FormSchema = z.object({
  discord: z.string(),
  dietary: z.string(),
  email: z.string().email(),
  linkedin: z.string(),
  telegram: z.string(),
  shirtSize: z.string(),
})

type FormSchemaType = z.infer<typeof FormSchema>

const ProfileContactInfo = (props: {
  user: User
  refetch: () => Promise<QueryObserverResult>
}) => {
  const toast = useToast()
  const { isLoading: isSubmitting, mutateAsync } =
    trpc.user.updateUserContacts.useMutation()

  const [edit, setEdit] = useState(false)
  const onEdit = useCallback(() => setEdit(!edit), [edit])

  const { register, handleSubmit } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      discord: props.user.discord || '',
      dietary: props.user.dietary || '',
      email: props.user.email || '',
      linkedin: props.user.linkedin || '',
      shirtSize: props.user.shirtSize || '',
      telegram: props.user.telegram || '',
    },
  })

  const formSubmit = useCallback(
    async (formData: FormSchemaType) => {
      try {
        await mutateAsync({
          dietary: formData.dietary,
          discord: formData.discord,
          email: formData.email,
          linkedin: formData.linkedin,
          shirtSize: formData.shirtSize,
          telegram: formData.telegram,
        })

        await props.refetch()
        setEdit(false)

        toast({
          duration: 3000,
          status: 'success',
          title: 'Success',
          description: Message.PERSONAL_INFO_SUCCESS,
        })
      } catch (e) {
        toast({
          duration: 3000,
          status: 'error',
          title: 'Oops, an error occured!',
          description: (e as Error).message,
        })
      }
    },
    [mutateAsync, props, toast]
  )

  return (
    <div className="relative">
      <EditProfileBtn onEdit={onEdit} edit={edit} />
      <form onSubmit={handleSubmit(formSubmit)}>
        <Box
          backgroundColor="#F7FCFF"
          borderRadius="24px"
          boxShadow="0px 1px 1px rgba(0, 0, 0, 0.2)"
          className="flex flex-col gap-3 py-6 px-10"
        >
          <Box className="flex items-center gap-3">
            <BsEnvelopeFill size="20px" className="fill-[#97AEFF]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="email"
              fieldValue={props.user.email}
            />
          </Box>

          <Box className="flex items-center gap-3">
            <MdFastfood size="20px" className="fill-[#97AEFF]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="dietary"
              fieldValue={props.user.dietary as string}
            />
          </Box>

          <Box className="flex items-center gap-3">
            <BsTelegram size="20px" className="fill-[#97AEFF]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="telegram"
              fieldValue={props.user.telegram as string}
            />
          </Box>

          <Box className="flex items-center gap-3">
            <BsDiscord size="20px" className="fill-[#97AEFF]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="discord"
              fieldValue={props.user.discord as string}
            />
          </Box>

          <Box className="flex items-center gap-3">
            <BsLinkedin size="20px" className="fill-[#97AEFF]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="linkedin"
              fieldValue={props.user.linkedin as string}
            />
          </Box>

          <Box className="flex items-center gap-3">
            <FaTshirt size="20px" className="fill-[#97AEFF]" />
            <DynamicInputField
              edit={edit}
              isSubmitting={isSubmitting}
              register={register}
              field="shirtSize"
              fieldValue={props.user.shirtSize as string}
            />
          </Box>
        </Box>
        {edit && <SubmitEditBtn />}
      </form>
    </div>
  )
}

export default ProfileContactInfo
