import {
  Box,
  Flex,
  ModalHeader,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { ModalContext } from '~/context/ModalContext'
import { trpc } from '~/utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { type BodyProps } from '~/types/event/event.type'

const EventModal = () => {
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
      </ModalContent>
    </Modal>
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
    <Flex direction="column" pb={24}>
      <Flex justify="space-between" py={4}>
        <Box>{'Time: 12.00PM'}</Box>
        <Box>{'Venue: LT69'}</Box>
      </Flex>
      <Box py={6}>{'Description: This is a very fun event.'}</Box>
    </Flex>
  )
}

export default EventModal
