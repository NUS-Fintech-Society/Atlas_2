import { trpc } from '../../utils/trpc'
import type { Session } from 'next-auth'
import LoadingScreen from '../common/LoadingScreen'
import { Box, Button, Image, Text } from '@chakra-ui/react'
import UploadImageBtn from './UploadImageButton'


const DEFAULT_IMAGE = '/fintech_logo.png'

const UploadImage = ({
  studentId,
  session,
}: {
  studentId: string
  session: Session
}) => {
  const { data, isError, isLoading, refetch: refetchImage, } =
  trpc.user.getUserImage.useQuery(studentId)

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!data || isError) {
    return <p className="text-3xl">Something is wrong</p>
  }

  return (
    <div className="m-10 grid grid-cols-1 place-items-center gap-y-6 md:grid-cols-3">
        <div/>
      <div className="md:place-self-center">
      <Box className="relative">
        <Image
          alt="profile-pic"
          src={isLoading || !data ? DEFAULT_IMAGE : data}
          fallbackSrc={DEFAULT_IMAGE}
          objectFit="cover"
          borderRadius="full"
          boxSize="200px"
        />

          <Box className="absolute bottom-0 right-0">
            <UploadImageBtn refetchImage={refetchImage} studentId={studentId} />
          </Box>

      </Box>
      </div>
    </div>
  )
}

export default UploadImage
