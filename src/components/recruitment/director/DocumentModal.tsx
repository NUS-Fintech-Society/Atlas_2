import {
  Box,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BsFolder2Open } from 'react-icons/bs'
import { StorageService } from '~/utils/storage'
import DocumentModalCard from './DocumentModalCard'

const DocumentModal = ({
  id,
  name,
  resume,
}: {
  id: string
  name: string
  resume: string | undefined
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [fileList, setFileList] = useState<string[]>([])
  const docsFilePath = `${id}/documents/`

  // // Hook to get the files associated with the applicant (FOR FUTURE FIRESTORE INTEGRATION)
  // useEffect(() => {
  //   const getFilesList = async () => {
  //     const fileList = await StorageService.getFiles(docsFilePath)
  //     setFileList(fileList)
  //   }
  //   getFilesList()
  // }, [docsFilePath])

  return (
    <Box className="absolute left-5 top-10">
      <IconButton
        aria-label="Upload documents"
        icon={<BsFolder2Open />}
        bg="None"
        _hover={{ background: 'None' }}
        onClick={onOpen}
        fontSize="23px"
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          pb={5}
          backgroundColor="#F1F3FF"
          borderRadius="20px"
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        >
          <ModalHeader textAlign="center" fontSize="2xl">
            {name} Documents
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex justify-center">
            <DocumentModalCard
              file={resume as string}
              key={resume}
              documentName="Resume"
            />
            {/* <div className="my-5 mx-10 grid grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2 ">
              { // FOR FUTURE FIRESTORE INTEGRATION WITH UPLOAD DOCUMENT
                fileList.map((file) => {
                  return <DocumentModalCard file={file} key={file} />
                })
              }
            </div> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DocumentModal
