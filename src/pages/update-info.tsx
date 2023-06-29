import {
  Input,
  FormLabel,
  VStack,
  useToast,
  Button,
  Select,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState, type ChangeEvent } from 'react'
import Head from 'next/head'
import Container from '~/components/auth/Container'
import UploadImage from '~/components/profile/UploadImage'
import { trpc } from '~/utils/trpc'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import withApplicantAuth, { type BaseProps } from '~/utils/withApplicantAuth'
import { getSession } from 'next-auth/react'
import { type GetServerSidePropsContext } from 'next'

const UpdateInfoPage: React.FC<BaseProps> = ({ session }) => {
  const router = useRouter()
  const toast = useToast()
  const [selectedShirtSize, setShirtSize] = useState<string>()

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
    shirtSize: z.string().min(1, { message: 'Invalid size' }),
    dietary: z.string().min(1, { message: 'Invalid dietary requirement' }),
    discord: z.string().min(1, { message: 'Invalid ID' }),
  })

  type FormSchemaType = z.infer<typeof FormSchema>

  const { register, handleSubmit } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  })

  const { mutateAsync, isLoading: isSubmitting } =
    trpc.user.updateUserInfo.useMutation()

  const formSubmit = async (formData: FormSchemaType) => {
    const { telegram, shirtSize, linkedin, discord, dietary } = formData

    try {
      await mutateAsync({
        //toDO: add json attributes
        studentId,
        telegram,
        shirtSize,
        linkedin,
        discord,
        dietary,
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
          content="Onboarding member particulars for Atlas"
        />
      </Head>

      <Container>
        <form onSubmit={handleSubmit(formSubmit)}>
          <h1 className="mb-10 text-center text-2xl font-bold">
            Update Member Particulars
          </h1>

          <div className="justify-center">
            <UploadImage studentId={session?.user?.id as string} />
          </div>

          <VStack align="left">
            <div>
              <FormLabel>Fintech Society Shirt Size</FormLabel>
            </div>

            <div className="flex justify-center">
              <Select
                {...register('shirtSize', { required: true })}
                value={selectedShirtSize}
                onChange={handleSelectChange}
              >
                <option value="">Select Shirt Size</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <br />
            <div>
              <FormLabel> Telegram Handle</FormLabel>
              <Input
                type="text"
                disabled={isSubmitting}
                {...register('telegram', { required: true })}
                placeholder="Telegram Handle"
              />
            </div>
            <br />
            <div>
              <FormLabel> Linkedin URL </FormLabel>
              <Input
                type="text"
                disabled={isSubmitting}
                {...register('linkedin', { required: true })}
                placeholder="Linkedin URL"
              />
            </div>
            <br />

            <div>
              <FormLabel> Discord Handle </FormLabel>
              <Input
                type="text"
                disabled={isSubmitting}
                {...register('discord', { required: true })}
                placeholder="Discord Handle"
              />
            </div>

            <br />

            <div>
              <FormLabel> Dietary Requirements </FormLabel>
              <Input
                type="text"
                disabled={isSubmitting}
                {...register('dietary', { required: true })}
                placeholder="Dietary Requirements (Vegetarian etc)"
              />
            </div>

            <br />

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

export default withApplicantAuth(UpdateInfoPage)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  // If not logged in, redirect to the login page.
  // If he is an applicant, redirect him to the applicant page.
  // If he does not have admin access, redirect to the home page.
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  } else if (!session.isApplicant) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
