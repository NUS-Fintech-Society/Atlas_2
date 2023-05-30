import { trpc } from '../../utils/trpc'
import { Box, Button, Image, Text } from '@chakra-ui/react'
import type { Session } from 'next-auth'
import { useRouter } from 'next/router'
import UploadImageBtn from './UploadImageButton'
import { type QueryObserverResult } from '@tanstack/react-query'

const DEFAULT_IMAGE = '/fintech_logo.png'

const ProfileCard = ({
  name,
  dept,
  role,
  studentId,
  session,
  refetch,
}: {
  name: string | null
  dept: string | null
  role: string | null
  studentId: string
  session: Session
  refetch: () => Promise<QueryObserverResult>
}) => {
  const router = useRouter()
  const redirectToResetPassword = () => router.push('/auth/forgetpassword')

  const {
    isLoading,
    data,
    refetch: refetchImage,
  } = trpc.user.getUserImage.useQuery(studentId)

  return (
    <Box className="mb-10 flex flex-col items-center">
      <Box className="relative">
        <Image
          alt="profile-pic"
          src={isLoading || !data ? DEFAULT_IMAGE : data}
          fallbackSrc={DEFAULT_IMAGE}
          objectFit="cover"
          borderRadius="full"
          boxSize="170px"
        />
        {session?.user?.id === studentId ? (
          <Box className="absolute bottom-0 right-0">
            <UploadImageBtn
              refetchImage={refetchImage}
              refetch={refetch}
              studentId={studentId}
            />
          </Box>
        ) : null}
      </Box>
      <Box className="flex flex-col items-center py-2">
        <Text textColor="##FFFFFF" className="text-2xl font-medium">
          {name}
        </Text>
        <Text textColor="##FFFFFF">{dept}</Text>
        <Text textColor="#FFFFFF">{role}</Text>
      </Box>
      <Button
        boxSizing="border-box"
        border="1px solid #FFFFFF"
        className="mt-10 rounded-lg px-4 py-2"
        textColor="#FFFFFF"
        variant="ghost"
        _hover={{ bg: '#97AEFF' }}
        onClick={redirectToResetPassword}
      >
        Reset Password
      </Button>
    </Box>
  )
}

export default ProfileCard
