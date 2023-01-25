import {
  Input,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Stack,
  VStack,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable } from '../../components/events/DataTable'
import { trpc } from '../../utils/trpc'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import LoadingScreen from '~/components/common/LoadingScreen'
import RestrictedPage from '~/components/auth/RestrictedPage'
import Container from '~/components/auth/Container'
import { useRouter } from 'next/router'

const EventPage = () => {
  const router = useRouter()
  const toast = useToast()

  const FormSchema = z.object({
    eventName: z.string().min(1, { message: 'Invalid name' }),
    dept: z
      .array(
        z.string({
          required_error: 'At least one department must be chosen',
          invalid_type_error: 'At least one department must be chosen',
        })
      )
      .nonempty({
        message: 'At least one department must be chosen',
      }),
    date: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date().min(new Date(), { message: 'A valid date is required' })),
  })

  type FormSchemaType = z.infer<typeof FormSchema>

  // useForm for state management except attendees which belongs in DataTable (child)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  })

  const [attendees, setAttendees] = useState<string[]>([])
  const [submitBefore, setSubmitBefore] = useState<boolean>(false) // hacky use for attendees validation
  const { data: session } = useSession()
  const { data: data } = trpc.event.getAllUsers.useQuery()
  const newEvent = trpc.event.createEvent.useMutation()

  const invalidAttendees = attendees.length === 0
  const formSubmit = async (formData: any) => {
    try {
      newEvent.mutate({
        name: formData.eventName,
        date: new Date(formData.date),
        departments: formData.dept,
        attendees: attendees,
      })

      // Delay 2s
      await new Promise(async (resolve) => {
        await setTimeout(() => {
          resolve(undefined)
        }, 2000)
      })

      toast({
        description: 'A new event has been successfully created!',
      })
    } catch (e) {
      toast({
        description: (e as Error).message,
        duration: 3000,
        status: 'error',
        title: 'Oops, an error occured!',
      })
    }
  }
  const redirectHome = () => router.push('/admin')

  if (session?.level !== 'super') return <RestrictedPage />
  if (!data) return <LoadingScreen />

  return (
    <>
      <Head>
        <title>Atlas | Create Event</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The create event page for Atlas" />
      </Head>
      <Container>
        <form onSubmit={handleSubmit(formSubmit)}>
          <h1 className="mb-10 text-center text-2xl font-bold">
            Create New Event
          </h1>
          <VStack align="left" spacing="6">
            <div>
              <FormLabel>Event Name</FormLabel>
              <Input
                type="text"
                disabled={isSubmitting}
                {...register('eventName', { required: true })}
              />
              {errors.eventName && (
                <Text color="tomato" className="pt-2">
                  {errors.eventName.message}
                </Text>
              )}
            </div>
            <VStack align="left">
              <div className="flex">
                <FormLabel>Department</FormLabel>
                <CheckboxGroup>
                  <Stack spacing={[1, 5]} direction={['row', 'column']}>
                    <Checkbox value="ml" {...register('dept')}>
                      Machine Learning
                    </Checkbox>
                    <Checkbox value="sd" {...register('dept')}>
                      Software Development
                    </Checkbox>
                    <Checkbox value="bc" {...register('dept')}>
                      Blockchain
                    </Checkbox>
                    <Checkbox value="ir" {...register('dept')}>
                      Internal Relations
                    </Checkbox>
                    <Checkbox value="ea" {...register('dept')}>
                      External Affairs
                    </Checkbox>
                  </Stack>
                </CheckboxGroup>
              </div>
              {errors.dept && (
                <Text color="tomato" className="pt-2">
                  {errors.dept.message}
                </Text>
              )}
            </VStack>
            <div>
              <FormLabel>Date</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                disabled={isSubmitting}
                className="dark:[color-scheme:dark]"
                {...register('date', { required: true })}
              />
              {errors.date && (
                <Text color="tomato" className="pt-2">
                  {errors.date.message}
                </Text>
              )}
            </div>
            <div className="flex items-center">
              <FormLabel>QR Code required</FormLabel>
              <Checkbox disabled={isSubmitting}></Checkbox>
            </div>
            <DataTable data={data} setAttendees={setAttendees} />
            {submitBefore && invalidAttendees && (
              <Text color="tomato">At least one attendee is required</Text>
            )}
            <div className="flex justify-between">
              <Button
                bgColor="#FF9900"
                width={150}
                textColor="black"
                onClick={redirectHome}
              >
                Back
              </Button>
              <Button
                bgColor="#4365DD"
                width={150}
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSubmitBefore(true)}
              >
                Create Event
              </Button>
            </div>
          </VStack>
        </form>
      </Container>
    </>
  )
}

export default EventPage
