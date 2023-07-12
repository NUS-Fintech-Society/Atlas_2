import {
  Button,
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
  useToast,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { ModalContext } from '~/context/ModalContext'
import { trpc } from '~/utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import Image from 'next/image'
import { type BodyProps } from '~/types/event/event.type'
import Link from 'next/link'

const DataTableModal = () => {
  const modal = useContext(ModalContext)
  const { data, isLoading } = trpc.event.getEvent.useQuery(modal.id)

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
      <ModalContent minW="1000px">
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
  const modal = useContext(ModalContext)
  const toast = useToast()
  if (!data) {
    return <div>No Event Found</div>
  }

  dayjs.extend(LocalizedFormat)
  const startDate = dayjs(data.startDate).format('lll')
  const endDate = dayjs(data.endDate).format('lll')

  const { mutateAsync, isLoading: isSubmitting } =
    trpc.event.deleteEvent.useMutation()
  const confirmDelete = async () => {
    try {
      await mutateAsync({
        id: modal.id,
      })
      // console.log("ping")
      toast({
        duration: 3000,
        status: 'success',
        title: 'Success',
        description: 'The event has been successfully deleted',
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
  return (
    <>
      {data.qr_code && (
        <div className="m-2 flex flex-row items-center justify-center">
          <Image alt="event-qr" height={200} src={data.qr_code} width={200} />
        </div>
      )}
      <p>Departments:</p>
      {data.departments.map((dept) => {
        return <li key={dept}>{dept}</li>
      })}
      <p>Start Date: {startDate}</p>
      <p>End Date: {endDate}</p>
      <p>Attendance: {`${data.showup}/${data.invitedAttendees.length}`}</p>
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
          {data.invitedAttendees.map((attendee, index) => {
            return (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{attendee.name}</Td>
                <Td>{attendee.department}</Td>
                <Td>{attendee.role}</Td>
                <Td>{attendee.attended ? 'Yes' : 'No'}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <p>
        <div className="mt-5 flex flex-row items-center justify-between">
          <Link href={'/events/' + data.id} className="mb-10">
            <Button
              textColor="white"
              bgColor="transparent"
              border="2px solid #FFFFFF"
              disabled={isSubmitting}
            >
              Edit
            </Button>
          </Link>
          <form onSubmit={confirmDelete}>
            <Button
              className="mb-10 text-black"
              bgColor="#4365DD"
              type="submit"
              disabled={isSubmitting}
            >
              Delete
            </Button>
          </form>
        </div>
      </p>
    </>
  )
}

export default DataTableModal
