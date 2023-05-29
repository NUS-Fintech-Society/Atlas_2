import { AddIcon } from '@chakra-ui/icons'
import { Box, IconButton, Input, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { storage } from '../../../firebase'
import { ref, uploadBytes } from 'firebase/storage'
import { uuidv4 } from '@firebase/util'
import { Message } from '~/constant/messages'

const DocumentModalAdd = ({ applicantId }: { applicantId: string }) => {
  const toast = useToast()
  const [file, setFile] = useState<File>()

  const uploadFile = () => {
    if (file == null) return
    const fileRef = ref(storage, `${applicantId}/${file.name + uuidv4()}`)
    uploadBytes(fileRef, file)
      .then(() => {
        toast({
          duration: 2000,
          status: 'success',
          title: 'Success',
          description: Message.FILE_UPLOAD_SUCCESS,
        })
      })
      .catch(() => {
        toast({
          duration: 2000,
          status: 'error',
          title: 'Error',
          description: Message.FILE_UPLOAD_FAIL,
        })
      })
  }

  return (
    <Box className="mx-10 mt-10 mb-4 flex">
      <Input
        type="file"
        mr="4"
        onChange={(e) => {
          if (e.target.files) setFile(e.target.files[0])
        }}
      ></Input>
      <IconButton
        aria-label="Info popup for applicant detail"
        icon={<AddIcon />}
        borderRadius="30px"
        boxShadow="0px 4px 4px 2px rgba(0, 0, 0, 0.15)"
        bg="white"
        _hover={{ background: '#e4e8ff' }}
        fontSize="16px"
        p="4"
        width="30px"
        height="30px"
        onClick={uploadFile}
      />
    </Box>
  )
}

export default DocumentModalAdd
