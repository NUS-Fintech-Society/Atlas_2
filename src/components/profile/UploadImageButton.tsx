import { type ChangeEvent, useRef } from 'react'
import { trpc } from '../../utils/trpc'
import { IconContext } from 'react-icons'
import { Button, useToast } from '@chakra-ui/react'
import EditIcon from './EditIcon'
import { type QueryObserverResult } from '@tanstack/react-query'
import { Message } from '~/constant/messages'

const UploadImageBtn = ({
  studentId,
  refetch,
}: {
  studentId: string
  refetch: () => Promise<QueryObserverResult>
}) => {
  const toast = useToast()
  // trigger a click event on the file input element when button is clicked
  const uploadRef = useRef<HTMLInputElement>(null)
  const { mutateAsync } = trpc.member.updateMemberImage.useMutation()
  const onUpload = () => {
    uploadRef.current?.click()
  }
  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const reader = new FileReader()
      reader.addEventListener('load', async () => {
        try {
          const imageDataURI = reader.result as string
          const image = imageDataURI as string
          toast({
            duration: 1000,
            title: Message.IMAGE_UPLOAD_LOADING,
            status: 'loading',
          })
          await mutateAsync({ studentId, image })
          await refetch()
          toast({
            duration: 3000,
            description: Message.IMAGE_UPLOAD_SUCCESS,
            title: 'Success',
            status: 'success',
          })
        } catch (e) {
          toast({
            duration: 3000,
            description: Message.IMAGE_UPLOAD_ERROR,
            status: 'error',
            title: 'Something went wrong',
          })
        }
      })
      reader.readAsDataURL(e?.target?.files[0] as Blob)
    }
  }
  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={onUpload}
      _hover={{ bg: 'None' }}
    >
      <IconContext.Provider value={{ size: '20px' }}>
        <EditIcon active={false} />
      </IconContext.Provider>
      <input
        type="file"
        accept="image/png, image/jpeg"
        ref={uploadRef}
        onChange={handleFileSelected}
        className="hidden"
      />
    </Button>
  )
}

export default UploadImageBtn
