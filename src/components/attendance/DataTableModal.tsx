import {
  ModalHeader,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Table,
  Thead,
  Th,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { EventModalContext } from '~/context/events/EventModalContext'
import { trpc } from '~/utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import Image from 'next/image'
import { type BodyProps } from '~/types/event/event.type'

const DataTableModal = () => {
  const modal = useContext(EventModalContext)
  const { data, isLoading } = trpc.event.getEventInfo.useQuery(modal.id)

  if (!modal.id) {
    return null
  }

  return (
    <Modal
      isCentered
      isOpen={modal.isOpen}
      onClose={modal.onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isLoading
            ? 'Please wait while we are fetching the event'
            : data?.name}
        </ModalHeader>
        <ModalBody className="bg-[#01003D] font-[Inter] text-xl text-white">
          {isLoading ? <LoadingScreen /> : <Body data={data} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const Body: React.FC<{ data: BodyProps | null | undefined }> = ({ data }) => {
  if (!data) {
    return <div>No Event Found</div>
  }

  dayjs.extend(LocalizedFormat)
  const startDate = dayjs(data.startDate).format('lll')
  const endDate = dayjs(data.endDate).format('lll')

  return (
    <>
      {data.qr_code && (
        <div className="flex flex-row items-center justify-center">
          <Image alt="event-qr" height={200} src={data.qr_code} width={200} />
        </div>
      )}
      <p>Department: </p>
      <p>Start Date: {startDate}</p>
      <p>End Date: {endDate}</p>
      <p>Attendance: {`${data._count.Attendance}/${data._count.attendees}`}</p>
      <p>Required Attendees:</p>
      <Table>
        <Thead>
          <Th color="white">No.</Th>
          <Th color="white">Name</Th>
          <Th color="white">Department</Th>
          <Th color="white">Role</Th>
          <Th color="white">Attendance</Th>
        </Thead>
        <Tbody>
          {data.attendees.map((attendee, index) => {
            return (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{attendee.name}</Td>
                <Td>{attendee.department}</Td>
                <Td>{attendee.role}</Td>
                <Td>{data.attended.has(attendee.id) ? 'Yes' : 'No'}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </>
  )
}

export default DataTableModal
