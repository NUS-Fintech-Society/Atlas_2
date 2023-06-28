import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useRef,
  useState,
} from 'react'
import { trpc } from '../../utils/trpc'
import LoadingScreen from '~/components/common/LoadingScreen'
import { BsTrash, BsUpload } from 'react-icons/bs'
import { IconContext } from 'react-icons'
import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import Image from 'next/image'
import type { Session } from 'next-auth'
import { StorageService } from '~/utils/storage'

const defaultImage = '/150.png'

const ProfilePage = ({
  studentId,
  session,
}: {
  studentId: string
  session: Session
}) => {
  // TRPC USEQUERY HOOK: SET REFETCH TO FALSE TO CACHE THE DATA
  const { data, isLoading, isError } = trpc.user.getUserProfile.useQuery(
    studentId,
    {
      refetchOnWindowFocus: false,
    }
  )

  // IF THE DATA IS LOADING, RETURN THE LOADING SCREEN
  if (isLoading) return <LoadingScreen />

  // IF THERE IS SOMETHING WRONG WITH FETCHING THE USER, THROW AN ERROR
  if (!data || isError) {
    return <p className="text-3xl">Something is wrong</p>
  }

  return (
    <div className="mt-4 flex flex-wrap justify-between gap-6">
      {/* <ProfileInfo {...data} /> */}
      <div className="flex flex-col">
        <ProfilePicture studentId={studentId} session={session} />
        {/* <ProfileContactInfo {...data} /> */}
      </div>
    </div>
  )
}

// const ProfileContactInfo = (props: { email: string }) => {
//   return (
//     <Box className="flex flex-col gap-1">
//       <Box className="flex items-center gap-1">
//         <BsTelegram className="fill-[#0088cc]" />
//         <p>{props.telegram}</p>
//       </Box>
//       <Box className="flex items-center gap-1">
//         <BsDiscord className="fill-[#5865F2]" />
//         <p>{props.discord}</p>
//       </Box>
//       <Box className="flex items-center gap-1">
//         <BsEnvelopeFill />
//         <p>{props.personal_email}</p>
//       </Box>
//       <Box className="flex items-center gap-1">
//         <BsEnvelopeFill className="fill-blue-300" />
//         <p>{props.email}</p>
//       </Box>
//     </Box>
//   )
// }

const ProfilePicture = ({
  studentId,
  session,
}: {
  studentId: string
  session: Session
}) => {
  const [image, setImage] = useState(defaultImage)

  trpc.user.getUserImage.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onSuccess(data) {
      if (!data) return
      setImage(data)
    },
  })

  return (
    <Box className="flex flex-col items-center">
      <Box className="my-2">
        <Image
          alt="profile-pic"
          src={image}
          height={150}
          width={150}
          unoptimized={true} // needed for use with objectURLs
        />
        {session.user?.id === studentId ? (
          <Box className="flex justify-end">
            <UploadImageBtn setImage={setImage} />
            <DeleteImageBtn setImage={setImage} studentId={studentId} />
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
// reference: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
const UploadImageBtn = ({
  setImage,
}: {
  setImage: Dispatch<SetStateAction<string>>
}) => {
  const toast = useToast()
  // trigger a click event on the file input element when button is clicked
  const uploadRef = useRef<HTMLInputElement>(null)
  const { mutateAsync } = trpc.user.updateUserImage.useMutation()
  const onUpload = () => {
    uploadRef.current?.click()
  }
  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const file = e.target.files.item(0)
      const reader = new FileReader()
      reader.addEventListener('load', async () => {
        try {
          const imageDataURI = reader.result as string
          const image = imageDataURI as string
          await mutateAsync({ image })
          toast({
            duration: 3000,
            description: 'Image successfully uploaded.',
            title: 'Success',
            status: 'success',
          })
          setImage(imageDataURI)
        } catch (e) {
          toast({
            duration: 3000,
            description: (e as Error).message,
            status: 'error',
            title: 'Something went wrong',
          })
        }
      })
      reader.readAsDataURL(file as Blob)
    }
  }
  return (
    <Button variant={'ghost'} size={'xs'} onClick={onUpload}>
      <IconContext.Provider value={{ size: '24px' }}>
        <div>
          <BsUpload />
        </div>
      </IconContext.Provider>
      <input
        type={'file'}
        accept={'image/png, image/jpeg'}
        ref={uploadRef}
        onChange={handleFileSelected}
        className={'hidden'}
      />
    </Button>
  )
}

const DeleteImageBtn = ({
  setImage,
  studentId,
}: {
  setImage: Dispatch<SetStateAction<string>>
  studentId: string
}) => {
  const toast = useToast()
  const { mutateAsync } = trpc.user.deleteUserImage.useMutation({
    onSuccess: () => {
      setImage(defaultImage)
    },
  })

  // DELETE IMAGE LOGIC
  const handleDelete = async () => {
    try {
      await StorageService.deleteFile(`${studentId}/image/profile_pic`)
      await mutateAsync()
      toast({
        duration: 3000,
        description: 'Image successfully deleted.',
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
  }

  return (
    <Button variant={'ghost'} size={'xs'} onClick={handleDelete}>
      <IconContext.Provider value={{ size: '24px' }}>
        <div>
          <BsTrash />
        </div>
      </IconContext.Provider>
    </Button>
  )
}

const ProfileInfoModal = ({
  session,
  studentId,
  onClose,
  isOpen,
}: {
  session: Session
  studentId: string
  onClose: () => void
  isOpen: boolean
}) => {
  return (
    <div>
      <PersonalInformationModal
        isOpen={isOpen}
        onClose={onClose}
        studentId={studentId}
        session={session}
      />
    </div>
  )
}

const PersonalInformationModal = ({
  isOpen,
  onClose,
  studentId,
  session,
}: {
  isOpen: boolean
  onClose: () => void
  studentId: string
  session: Session
}) => {
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="white" borderRadius="lg">
        <ModalHeader borderTopRadius="lg" className="bg-blue-600">
          <p className="pl-4 text-white">Personal Information</p>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <ProfilePage studentId={studentId} session={session} />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}

type ProfilePageType = {
  name: string | null
  role: string | null
  gender: string | null
  batch: string | null
  year: string | null
  faculty: string | null
  major: string | null
  department: string | null
}

export default ProfileInfoModal
