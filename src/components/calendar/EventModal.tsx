import {
  Button,
  Box,
  Flex,
  ModalHeader,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { ModalContext } from '~/context/ModalContext'
import { trpc } from '~/utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { type BodyProps } from '~/types/event/event.type'
import SubmitAttendanceModal from './SubmitAttendanceModal'


const EventModal = () => {
  const modal = useContext(ModalContext)
  const { data, isLoading } = trpc.event.getEvent.useQuery(modal.id)

  //For SubmitAttendanceModal
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [id, setId] = useState<string>("")
  const openSubmitAttendanceModal = () => {
   
    setId(modal.id)
    onOpen()
    //modal.onClose()
  }
  
  if (!modal.id) {
    return null
  }

  return (
    <div>
    <Modal
      isCentered
      isOpen={modal.isOpen}
      onClose={modal.onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent minW="1000px" borderRadius="1.2rem" overflow="hidden">
        <ModalHeader className="bg-[#01003D] text-white">
          {isLoading ? (
            'Please wait while we are fetching the event'
          ) : (
            <Header data={data} />
          )}
        </ModalHeader>
        <ModalBody className="font-[Inter] text-xl" textColor="#01003D">
          {isLoading ? <LoadingScreen /> : <Body data={data} />}
        </ModalBody>
        <ModalFooter display="flex" justifyContent="space-between">
          <Button
            bgColor="#0C1747"
            width={150}
            className="mb-10 text-white"
            type="submit"
            onClick={() => modal.onClose()}
          >
            Back
          </Button>

          <Button
            bgColor="#F9A72B"
            width={215}
            className="mb-10 text-black"
            type="submit"
            onClick={() => {
              modal.onClose()
              openSubmitAttendanceModal()
            }}
          >
            Stats
          </Button>

          <Button
            bgColor="#F9A72B"
            width={215}
            className="mb-10 text-black"
            type="submit"
            onClick={() => {
              modal.onClose()
              openSubmitAttendanceModal()
            }}
          >
            Submit Attendance
          </Button>
        </ModalFooter>
      </ModalContent>
      
    </Modal>
    <ModalContext.Provider
        value={{
          isOpen,
          id,
          onClose,
        }}
      >
        <SubmitAttendanceModal />
      </ModalContext.Provider>
    </div>
    

  )
}

const Header: React.FC<{ data: BodyProps | null | undefined }> = ({ data }) => {
  if (!data) {
    return <></>
  }
  dayjs.extend(LocalizedFormat)
  const startDate = dayjs(data.startDate).format('lll')

  return (
    <Flex justify="space-between" py={8}>
      <Box float="left">{data.name}</Box>
      {/* <Box float="right">{data.startDate.toString()}</Box> */}
      <Box float="right">{startDate}</Box>
    </Flex>
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
    <Flex direction="column">
      <Flex justify="space-between" py={4}>
        <Box>{'Time: 1000 - 1200'}</Box>
        <Box>{'Venue: LT69'}</Box>
      </Flex>
      <Box py={6}>{'Description: This is a very fun event.'}</Box>
    </Flex>
  )
}

export default EventModal
