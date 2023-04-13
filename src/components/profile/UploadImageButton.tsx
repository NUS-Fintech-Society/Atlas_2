import { type ChangeEvent, useRef } from 'react'
import { trpc } from '../../utils/trpc'
import { IconContext } from 'react-icons'
import { Button, useToast } from '@chakra-ui/react'
import EditIcon from './EditIcon'

// reference: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
const UploadImageBtn = ({ studentId }: { studentId: string }) => {
  const toast = useToast()
  // trigger a click event on the file input element when button is clicked
  const uploadRef = useRef<HTMLInputElement>(null)
  const { mutateAsync } = trpc.member.updateMemberImage.useMutation()
  const onUpload = () => {
    uploadRef.current?.click()
  }
  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    console.log('Triggered')
    if (e.target.files) {
      const reader = new FileReader()
      reader.addEventListener('load', async () => {
        try {
          const imageDataURI = reader.result as string
          const image = imageDataURI as string
          await mutateAsync({ studentId, image })
          toast({
            duration: 3000,
            description: 'Image successfully uploaded.',
            title: 'Success',
            status: 'success',
          })
        } catch (e) {
          toast({
            duration: 3000,
            description: (e as Error).message,
            status: 'error',
            title: 'Something went wrong',
          })
        }
      })
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
        accept="image/*"
        ref={uploadRef}
        onChange={handleFileSelected}
        className="hidden"
      />
    </Button>
  )
}

export default UploadImageBtn
