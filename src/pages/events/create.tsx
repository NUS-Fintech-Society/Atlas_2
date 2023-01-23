import {
  FormLabel,
  Input,
  Checkbox,
  CheckboxGroup,
  Stack,
  VStack,
  Button,
  useToast,
} from '@chakra-ui/react'
import { DataTable } from '../../components/events/DataTable'
import { trpc } from '../../utils/trpc'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import LoadingScreen from '~/components/common/LoadingScreen'
import RestrictedPage from '~/components/auth/RestrictedPage'

const EventPage = () => {
  const toast = useToast()
  // useForm for state management except attendees which belongs in DataTable (child)
  const { register, handleSubmit } = useForm()
  const [attendees, setAttendees] = useState<string[]>([])
  const { data: session, status } = useSession()
  const { data: data } = trpc.event.getAllUsers.useQuery()
  const newEvent = trpc.event.createEvent.useMutation()

  const formSubmit = (formData: any) => {
    try {
      // console.log('Form args:', formData)
      // console.log('Selected attendees: ', attendees)
      newEvent.mutate({
        name: formData.eventName,
        date: new Date(formData.eventDate),
        departments: formData.dept,
        attendees: attendees,
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

  if (session?.level !== 'super') return <RestrictedPage />
  if (!data) return <LoadingScreen />

  return (
    <>
      <Head>
        <title>Atlas | Create Event</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The create event page for Atlas" />
      </Head>
      <div className="h-full items-center bg-black text-white">
        <div className="mx-auto max-w-4xl p-10">
          <h1 className="mb-10 text-center text-2xl font-bold">
            Create New Event
          </h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <VStack align="left" spacing="6">
              <div>
                <FormLabel>Event Name</FormLabel>
                <Input {...register('eventName')} />
              </div>
              <div className="flex">
                <FormLabel>Department</FormLabel>
                <CheckboxGroup colorScheme="green">
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
              <div>
                <FormLabel>Date</FormLabel>
                <Input
                  placeholder="Select Date and Time"
                  size="md"
                  type="date"
                  {...register('eventDate')}
                />
              </div>
              <div className="flex items-center">
                <FormLabel>QR Code required</FormLabel>
                <Checkbox></Checkbox>
              </div>
              <DataTable data={data} setAttendees={setAttendees} />
              <div className="flex justify-between">
                <Button bgColor="#FF9900" width={150} textColor="black">
                  Back
                </Button>
                <Button bgColor="#4365DD" width={150} type="submit">
                  Create Event
                </Button>
              </div>
            </VStack>
          </form>
        </div>
      </div>
    </>
  )
}

export default EventPage
