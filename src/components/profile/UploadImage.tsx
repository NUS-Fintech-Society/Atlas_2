import { trpc } from '../../utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import { Box, Image } from '@chakra-ui/react'
import UploadImageBtn from './UploadImageButton'

const DEFAULT_IMAGE = '/150.png'

const UploadImage = ({ studentId }: { studentId: string }) => {
  const {
    data,
    isLoading,
    refetch: refetchImage,
  } = trpc.user.getUserImage.useQuery()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="m-10 grid grid-cols-1 place-items-center gap-y-6 md:grid-cols-3">
      <div />
      <div className="md:place-self-center">
        <Box className="relative">
          <Image
            alt="profile-pic"
            src={!data ? DEFAULT_IMAGE : data}
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
