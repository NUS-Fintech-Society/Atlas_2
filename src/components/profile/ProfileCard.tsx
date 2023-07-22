import { trpc } from '../../utils/trpc'
import { Box, Button, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import UploadImageBtn from './UploadImageButton'
import { useCallback } from 'react'

const DEFAULT_IMAGE = '/blank_profile.png'

const ProfileCard = ({
  name,
  dept,
  role,
  studentId,
}: {
  name: string | null
  dept: string | null
  role: string | null
  studentId: string
}) => {
  const router = useRouter()
  const { mutateAsync } = trpc.user.changePassword.useMutation()

  const resetPassword = useCallback(async () => {
    const link = await mutateAsync()
    router.push(link)
  }, [router, mutateAsync])

  const {
    isLoading,
    data,
    refetch: refetchImage,
  } = trpc.user.getUserImage.useQuery()

  return (
    <Box className="my-10 flex flex-col items-center">
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
      <Box className="flex flex-col items-center py-2">
        <Text textColor="#FFFFFF" className="text-2xl font-medium">
          {name}
        </Text>
        <Text textColor="#FFFFFF">{dept}</Text>
        <Text textColor="#FFFFFF">{role}</Text>
      </Box>
      <Button
        boxSizing="border-box"
        border="1px solid #FFFFFF"
        className="mt-10 rounded-lg px-4 py-2"
        textColor="#FFFFFF"
        variant="ghost"
        _hover={{ bg: '#97AEFF' }}
        onClick={resetPassword}
      >
        Reset Password
      </Button>
    </Box>
  )
}

export default ProfileCard
