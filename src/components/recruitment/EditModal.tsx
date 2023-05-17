import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { Avatar } from 'flowbite-react'
import { BsPencilSquare } from 'react-icons/bs'

const EditModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <IconButton
        aria-label="Edit details"
        icon={<BsPencilSquare />}
        bg="None"
        _hover={{ background: 'None' }}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          pb={4}
          backgroundColor="#F1F3FF"
          borderRadius="20px"
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        >
          <ModalHeader textAlign="center">Edit NAME</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(3, 1fr)" gap="6">
              <GridItem colSpan={2}>
                <Stack>
                  <FormControl>
                    <FormLabel>Application Status</FormLabel>
                    <Input placeholder="Application Status" />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Department</FormLabel>
                    <Input placeholder="Department" />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Interview Notes</FormLabel>
                    <Textarea placeholder="Interview Notes" />
                  </FormControl>
                </Stack>
              </GridItem>
              <GridItem>
                <Avatar alt="User-settings" rounded={true} size="lg" />
                <Text textAlign="center">Some long name we try</Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button bg="#97AEFF">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditModal
