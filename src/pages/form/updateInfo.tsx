import {
  Input,
  FormLabel,
  VStack,
  useToast,
  Button,
  Select,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import withAuth, { BaseProps }from '~/utils/withAuth'
import React, { useState, ChangeEvent } from 'react'
import Head from 'next/head'
import Container from '~/components/auth/Container'
import TopNavbar from '~/components/common/TopNavbar'
import UploadImage from '~/components/profile/UploadImage'
import { registerVersion } from '@firebase/app'
import { trpc } from '~/utils/trpc'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


const updateInfoPage: React.FC<BaseProps> = ({ session }) => {
  const router = useRouter()
  const toast = useToast()
  const [selectedShirtSize, setShirtSize] = useState<string>()
  const [submitBefore, setSubmitBefore] = useState(false)

  const studentId = session?.user?.id as string

  const options = [
    { value: 'xs', label: 'XS' },
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' },
  ]

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setShirtSize(event.target.value) // Update the selected value in the state
  }


  //Form Data Integrity
  const FormSchema = z.object({
    telegram: z.string().min(1, { message: 'Invalid name' }),
    linkedin: z.string().min(1, { message: 'Invalid url' }),
    shirtSize: z.string().min(1, { message: 'Invalid size' })
  })

  type FormSchemaType = z.infer<typeof FormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  })

  const { mutateAsync, isLoading: isSubmitting } =
    trpc.user.updateUserInfo.useMutation()

    const formSubmit = async (formData: FormSchemaType) => {
      try {

        await mutateAsync({

          //toDO: add json attributes
          studentId: studentId,
          telegram: formData.telegram,
          shirtSize: formData.shirtSize,
          linkedin: formData.linkedin,

        })
        toast({
          duration: 3000,
          status: 'success',
          title: 'Success',
          description: 'User profile has been successfully updated',
        })

        redirectHome()

        
      } catch (e) {
        toast({
          description: (e as Error).message,
          duration: 3000,
          status: 'error',
          title: 'Oops, an error occured!',
        })
      }
    }

  //toDO: Route to applicant status page created by Zeyu
  const redirectHome = () => router.push('/events')

  return (
    <>
      <Head>
        <title>Update Member Information</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Onboarding memebr particulars for Atlas"
        />
      </Head>
      <TopNavbar isAdmin={session.isAdmin} />

      <Container>
        <form onSubmit={handleSubmit(formSubmit)}>
          <h1 className="mb-10 text-center text-2xl font-bold">
            Update Member Particulars
          </h1>
          

          <div className="justify-center">
          <UploadImage session={session} studentId={session?.user?.id as string} />
          </div>

          <VStack align="left">

            <div>

              <FormLabel>Fintech Society Shirt Size</FormLabel>
              </div>

              <div className="flex justify-center">

              <Select  {...register('shirtSize', { required: true })} value={selectedShirtSize} onChange={handleSelectChange}>
                <option value="">Select Shirt Size</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <br/>
            <div>
            <FormLabel> Telegram Handle</FormLabel>
            <Input
            type='text'
            disabled={isSubmitting}
            {...register('telegram', {required: true})}
            placeholder='Telegram Handle' />
            </div>
            <br/>
            <div>
            <FormLabel> Linkedin URL </FormLabel>
            <Input
            type='text'
            disabled={isSubmitting}
            {...register('linkedin', {required: true})}
            placeholder='Linkedin URL' />
            </div>
            <br/>

            <div className="flex justify-between">
              <Button
                bgColor="#FF9900"
                width={150}
                textColor="white"
                onClick={redirectHome}
              >
                Back
              </Button>
              <Button
                bgColor="#4365DD"
                width={150}
                className="text-white"
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSubmitBefore(true)}
              >
                Update
              </Button>
            </div>

          </VStack>
        </form>
      </Container>
    </>
  )
}

export default withAuth(updateInfoPage)
