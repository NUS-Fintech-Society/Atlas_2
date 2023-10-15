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
import { DataTable } from '~/components/events/DataTable'
import { trpc } from '~/utils/trpc'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import LoadingScreen from '~/components/common/LoadingScreen'
import Container from '~/components/auth/Container'
import { useRouter } from 'next/router'
import withAuth from '~/utils/withAuth'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'

const CreateEventPage = () => {
  const router = useRouter()
  const toast = useToast()
  const [attendees, setAttendees] = useState<string[]>([])
  const [department, setDepartment] = useState<string[]>([])
  const [submitBefore, setSubmitBefore] = useState(false) // hacky use for attendees validation
  const [isQrRequired, setIsQrRequired] = useState(false)

  const FormSchema = z
    .object({
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
      startDate: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
      }, z.date().min(new Date(), { message: 'Invalid date' }).max(new Date('2100'), { message: 'Invalid date' })),
      endDate: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
      }, z.date().min(new Date(), { message: 'Invalid date' }).max(new Date('2100'), { message: 'Invalid date' })),
    })
    .refine(
      (data) => {
        const { startDate, endDate } = data
        return startDate <= endDate
      },
      {
        message: 'End date cannot be earlier than start date',
        path: ['endDate'],
      }
    )

  type FormSchemaType = z.infer<typeof FormSchema>

  // useForm for state management except attendees which belongs in DataTable (child)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  })

  const { data } = trpc.attendance.getAllAttendanceButSelf.useQuery()
  const { mutateAsync, isLoading: isSubmitting } =
    trpc.event.createEvent.useMutation()

  const invalidAttendees = attendees.length === 0
  const invalidDepartment = attendees.length === 0

  const formSubmit = async (formData: FormSchemaType) => {
    try {
      // Hacky soluton since attendees not linked to React-hook-form
      if (invalidAttendees) {
        return false
      }

      if (invalidDepartment) {
        return false
      }
      await mutateAsync({
        name: formData.eventName,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        departments: formData.dept,
        attendees: attendees,
        isQrRequired,
      })
      toast({
        duration: 3000,
        status: 'success',
        title: 'Success',
        description: 'A new event has been successfully created',
      })

      router.push('/events')
    } catch (e) {
      toast({
        description: (e as Error).message,
        duration: 3000,
        status: 'error',
        title: 'Oops, an error occured!',
      })
    }
  }
  const redirectHome = () => router.push('/events')

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
                    <Checkbox value="Machine Learning" {...register('dept')}>
                      Machine Learning
                    </Checkbox>
                    <Checkbox
                      value="Software Development"
                      {...register('dept')}
                    >
                      Software Development
                    </Checkbox>
                    <Checkbox value="Blockchain" {...register('dept')}>
                      Blockchain
                    </Checkbox>
                    <Checkbox value="Internal Affairs" {...register('dept')}>
                      Internal Affairs
                    </Checkbox>
                    <Checkbox value="External Relations" {...register('dept')}>
                      External Relations
                    </Checkbox>
                  </Stack>
                </CheckboxGroup>
              </div>
              {errors.dept && (
                <Text color="tomato" className="pt-2">
                  {'At least one department is required'}
                </Text>
              )}
            </VStack>
            <div>
              <FormLabel>Start Date</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                disabled={isSubmitting}
                {...register('startDate', { required: true })}
              />
              {errors.startDate && (
                <Text color="tomato" className="pt-2">
                  {errors.startDate.message}
                </Text>
              )}
            </div>
            <div>
              <FormLabel>End Date</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                disabled={isSubmitting}
                {...register('endDate', { required: true })}
              />
              {errors.endDate && (
                <Text color="tomato" className="pt-2">
                  {errors.endDate.message}
                </Text>
              )}
            </div>
            <div className="flex items-center">
              <FormLabel>QR Code required</FormLabel>
              <Checkbox
                disabled={isSubmitting}
                onChange={(e) => {
                  e.preventDefault()
                  setIsQrRequired(!isQrRequired)
                }}
              ></Checkbox>
            </div>
            <DataTable data={data} setAttendees={setAttendees} />
            {submitBefore && invalidAttendees && (
              <Text color="tomato">At least one attendee is required</Text>
            )}
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
                Create Event
              </Button>
            </div>
          </VStack>
        </form>
      </Container>
    </>
  )
}

export default withAuth(CreateEventPage, true)

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
  } else if (session.isApplicant) {
    return {
      redirect: {
        destination: '/status',
        permanent: false,
      },
    }
  } else if (!session.isAdmin) {
    return {
      redirect: {
        destination: '/calendar',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
