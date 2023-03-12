import { Box, Text, useToast } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { trpc } from '~/utils/trpc'
import Head from 'next/head'
import { useRouter } from 'next/router'
import HamburgerNavbar from '~/components/common/HamburgerNavbar'
import LoadingScreen from '~/components/common/LoadingScreen'
import ProfileGrid from '~/components/profile/ProfileGrid'

const ProfilePage = () => {
  const { status, data: session } = useSession({ required: true })

  if (status == 'loading') return <LoadingScreen />
  if (session.user) {
    return (
      <>
        <Head>
          <title>Atlas | Profile</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="The profile page for Atlas" />
        </Head>
        <HamburgerNavbar studentId={session.user.id} />
        <Box className="flex flex-col">
          <Text className="m-8 text-center text-3xl font-semibold underline underline-offset-8">
            Profile
          </Text>
          <ProfileGrid session={session} studentId={session.user.id} />
        </Box>
      </>
    )
  }
}

export default ProfilePage
