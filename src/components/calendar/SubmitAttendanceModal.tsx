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
  } from '@chakra-ui/react'
  import { useContext } from 'react'
  import { ModalContext } from '~/context/ModalContext'
  import { trpc } from '~/utils/trpc'
  import LoadingScreen from '../common/LoadingScreen'
  import LocalizedFormat from 'dayjs/plugin/localizedFormat'
  import dayjs from 'dayjs'
  import { type BodyProps } from '~/types/event/event.type'

  const SubmitAttendanceModal = () => {
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
              bgColor="#0C1747"
              width={215}
              className="mb-10 text-white"
              type="submit"
              onClick={() => {
                alert('Attendance Submitted Successfully!')
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
  
  const Header: React.FC<{ data: BodyProps | null | undefined }> = ({ data }) => {
    if (!data) {
      return <></>
    }

    return (
        <Box py={8}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      Submit Attendance
    </Box>

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
      <Flex direction="column" py={4}>
        <Flex direction="row">
        <Box className="w-40 mr-5">{'Event Name:'}</Box>
        <Box>{data.name}</Box>
        </Flex>
        <Flex direction="row">
        <Box className="w-40 mr-5">{'Date:'}</Box>
        <Box>{startDate}</Box>
        </Flex>
        <Flex direction="row">
        <Box className="w-40 mr-5">{'Time:'}</Box>
        <Box>{'1000 - 1200'}</Box>
        </Flex>
        <Flex direction="row">
        <Box className="w-40 mr-5">{'Venue:'}</Box>
        <Box>{'LT69'}</Box>
        </Flex>
        <Flex direction="row">
        <Box className="w-40 mr-5">{'Secret Code:'}</Box>
        <Box>{'XXXXXXXXXXXXX'}</Box>
        </Flex>
      
       
       
    
      </Flex>
    )
  }
  
  export default SubmitAttendanceModal
  