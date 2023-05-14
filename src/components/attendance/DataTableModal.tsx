import {
  ModalHeader,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { EventModalContext } from '~/context/events/EventModalContext'
import { trpc } from '~/utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import Image from 'next/image'

const DataTableModal = () => {
  const modal = useContext(EventModalContext)
  const { data, isLoading } = trpc.event.getEventInfo.useQuery(modal.id)

  if (!modal.id) {
    return null
  }

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isLoading
            ? 'Please wait while we are fetching the event'
            : data?.name}
        </ModalHeader>
        <ModalBody>
          {isLoading ? <LoadingScreen /> : <Body data={data} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

interface BodyProps {
  _count: {
    Attendance: number
    attendees: number
  }
  name: string
  id: string
  attendees: {
    name: string | null
    department: string | null
    id: string
    roles: string | null
  }[]
  endDate: Date
  hasStarted: boolean
  qr_code: string | null
  startDate: Date
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
    </>
  )
}

export default DataTableModal
