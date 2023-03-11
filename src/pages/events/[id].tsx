import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import Image from 'next/image'
import { useState } from 'react'
import HamburgerNavbar from '~/components/common/HamburgerNavbar'
import dayjs from 'dayjs'
import { type Event, type User } from '@prisma/client'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

const QrCode = ({ code }: { code: string | null }) => {
  if (!code) {
    return <h1>No QR Code to display</h1>
  }

  return <Image alt="QR code" height={300} src={code} width={300} />
}

const EventInfo = ({ data }: { data: Event }) => {
  const start = dayjs(data.startDate).format('llll')
  const end = dayjs(data.endDate).format('llll')
  return (
    <>
      <h1>Event: {data.name}</h1>
      <p>Start Date: {start}</p>
      <p>End Date: {end}</p>
    </>
  )
}

const AttendanceTable = ({ attendees }: { attendees: User[] }) => {
  return (
    <>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Department</Th>
            </Tr>
          </Thead>

          <Tbody>
            {attendees.map((attendee) => {
              return (
                <Tr key={attendee.id}>
                  <Td>{attendee.name}</Td>
                  <Td>{attendee.department}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

const EventPage = () => {
  const { status, data: session } = useSession({ required: true })
  const [shouldRefetch, setShouldRefetch] = useState(true)
  const router = useRouter()

  const { data, error, isLoading } = trpc.event.getEvent.useQuery(
    router.query.id as string,
    {
      enabled: shouldRefetch,
      onError: () => setShouldRefetch(false),
    }
  )

  if (isLoading || status === 'loading') {
    return <LoadingScreen />
  }

  if (error || !data) {
    return <h1>No QR code</h1>
  }

  if (session.isAdmin) {
    return (
      <>
        <HamburgerNavbar />
        <QrCode code={data.qr_code} />
        <EventInfo data={data} />
        <AttendanceTable attendees={data.attendees} />
      </>
    )
  }
  return <h1>Hiß</h1>
}

export default EventPage
