import { type ChangeEvent, useRef, useCallback } from 'react'
import { trpc } from '../../utils/trpc'
import { IconContext } from 'react-icons'
import { Button, useToast } from '@chakra-ui/react'
import EditIcon from './EditIcon'
import { type QueryObserverResult } from '@tanstack/react-query'
import { Message } from '~/constant/messages'
import { StorageService } from '~/utils/storage'

const UploadImageBtn = ({
  studentId,
  refetchImage,
}: {
  studentId: string
  refetchImage: () => Promise<QueryObserverResult>
}) => {
  const toast = useToast()
  // trigger a click event on the file input element when button is clicked
  const uploadRef = useRef<HTMLInputElement>(null)
  const { mutateAsync } = trpc.user.updateUserImage.useMutation()
  const onUpload = () => {
    uploadRef.current?.click()
  }
  const handleFileSelected = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files) {
          toast({
            duration: 1000,
            title: Message.IMAGE_UPLOAD_LOADING,
            status: 'loading',
          })

          const image = await StorageService.uploadFile(
            e.target.files[0] as Blob,
            `${studentId}/image/profile_pic`
          )
          await mutateAsync({
            image,
          })
          await refetchImage()
          toast({
            duration: 3000,
            description: Message.IMAGE_UPLOAD_SUCCESS,
            title: 'Success',
            status: 'success',
          })
        }
      } catch (e) {
        toast({
          duration: 3000,
          description: Message.IMAGE_UPLOAD_ERROR,
          status: 'error',
          title: 'Something went wrong',
        })
      }
    },
    [studentId, mutateAsync, toast, refetchImage]
  )
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
