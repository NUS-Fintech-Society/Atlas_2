import {
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  CheckboxGroup,
  Stack,
  VStack,
  Button,
} from '@chakra-ui/react'
import { DataTable, columns } from '../../components/events/DataTable'
import { trpc } from '../../utils/trpc'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
//TODO: Make the form submit stuff
//https://chakra-ui.com/docs/components/form-control
//https://chakra-ui.com/docs/components/checkbox

const EventPage = () => {
  const { data: data } = trpc.event.getAllUsers.useQuery()
  const newEvent = trpc.event.createEvent.useMutation()
  const { data: session, status } = useSession()
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventDepart, setEventDepart] = useState<string[]>([])
  const [attendee, setAttendee] = useState<string[]>([])

  const updateEventDepart = (event: any) => {
    event = event.valueOf().toString()
    setEventDepart([...eventDepart, event])
  }

  const sendDataToParent = (att: string[]) => {
    // the callback. Use a better name
    setAttendee(att)
  }

  if (!data) {
    if (status == 'unauthenticated') {
      alert('Unauthorized!!')
    }
    return <div>Loading...</div>
  } else {
    return (
      <div className="h-screen items-center bg-black text-white">
        <div className="mx-auto max-w-4xl p-10">
          <h1 className="mb-10 text-center text-2xl font-bold">
            Create New Event
          </h1>
          <FormControl>
            <VStack align="left" spacing="6">
              <div>
                <FormLabel>Event Name</FormLabel>
                <Input
                  type="text"
                  value={eventName}
                  onChange={(event) => setEventName(event.target.value)}
                />
              </div>
              <div className="flex">
                <FormLabel>Department</FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  onChange={(event) => updateEventDepart(event)}
                >
                  <Stack spacing={[1, 5]} direction={['row', 'column']}>
                    <Checkbox value="ml">Machine Learning</Checkbox>
                    <Checkbox value="sd">Software Development</Checkbox>
                    <Checkbox value="bc">Blockchain</Checkbox>
                    <Checkbox value="ir">Internal Relations</Checkbox>
                    <Checkbox value="ea">External Affairs</Checkbox>
                  </Stack>
                </CheckboxGroup>
              </div>
              <div>
                <FormLabel>Date</FormLabel>
                <Input
                  placeholder="Select Date and Time"
                  size="md"
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                />
              </div>
              <div className="flex items-center">
                <FormLabel>QR Code required</FormLabel>
                <Checkbox></Checkbox>
              </div>
              <div>
                <DataTable
                  columns={columns}
                  data={data}
                  sendDataToParent={sendDataToParent}
                />
              </div>
              <div className="flex justify-between">
                <Button bgColor="#FF9900" width={150} textColor="black">
                  Back
                </Button>
                <Button
                  bgColor="#4365DD"
                  width={150}
                  onClick={(event) => {
                    event.preventDefault()

                    newEvent.mutate({
                      name: eventName,
                      date: new Date(eventDate),
                      departments: eventDepart,
                      attendees: attendee,
                    })
                    setEventName('')
                    setEventDate('')
                    setEventDepart([])
                    alert('A new event is successfully created!')
                  }}
                >
                  Create Event
                </Button>
              </div>
            </VStack>
          </FormControl>
        </div>
      </div>
    )
  }
}
export default EventPage
