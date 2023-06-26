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
import { useForm, useFormState } from 'react-hook-form'
import Head from 'next/head'
import LoadingScreen from '~/components/common/LoadingScreen'
import Container from '~/components/auth/Container'
import { useRouter } from 'next/router'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'

const EventPage: React.FC<BaseProps> = ({ session }) => {
  const router = useRouter()
  const toast = useToast()
  const [attendees, setAttendees] = useState<string[]>([])
  const [submitBefore, setSubmitBefore] = useState(false) // hacky use for attendees validation
  const [isQrRequired, setIsQrRequired] = useState(false)

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
    startDate: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date().min(new Date(), { message: 'Invalid date' }).max(new Date('2100'), { message: 'Invalid date' })),
    endDate: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date().min(new Date(), { message: 'Invalid date' }).max(new Date('2100'), { message: 'Invalid date' })),
  })

  type FormSchemaType = z.infer<typeof FormSchema>

  // useForm for state management except attendees which belongs in DataTable (child)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  })

  const attendeesData =
    trpc.attendance.getAllAttendanceButSelf.useQuery()['data']
  const queryID = router.query.id?.toString?.() ?? ''
  const eventData = trpc.event.getEvent.useQuery(queryID)['data']

  const { mutateAsync, isLoading: isSubmitting } =
    trpc.event.updateEvent.useMutation()
  const invalidAttendees = attendees.length === 0
  const formSubmit = async (formData: FormSchemaType) => {
    try {
      // Hacky soluton since attendees not linked to React-hook-form
      if (invalidAttendees) {
        return false
      }

      await mutateAsync({
        id: eventData!.id!,
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
        description: 'The event has been successfully updated',
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
  const redirectHome = () => router.push('/events')

  if (!attendeesData) return <LoadingScreen />

  // console.log(register)

  return (
    <>
      <Head>
        <title>Atlas | Update Event</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The update event page for Atlas" />
      </Head>
      <TopNavbar
        isAdmin={session.isAdmin}
        image={session.user?.image as string}
        isApplicant={session.isApplicant}
      />
      <Container>
        <form onSubmit={handleSubmit(formSubmit)}>
          <h1 className="mb-10 text-center text-2xl font-bold">Update Event</h1>
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
            <DataTable data={attendeesData} setAttendees={setAttendees} />
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
                Update Event
              </Button>
            </div>
          </VStack>
        </form>
      </Container>
    </>
  )
}

export default withAuth(EventPage)
