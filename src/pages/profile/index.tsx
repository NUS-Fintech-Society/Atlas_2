import { Box, Text } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import LoadingScreen from '~/components/common/LoadingScreen'
import TopNavbar from '~/components/common/TopNavbar'
import ProfileGrid from '~/components/profile/ProfileGrid'

const ProfilePage = () => {
  const { status, data: session } = useSession({ required: true })

  if (status == 'loading') return <LoadingScreen />
  if (session.user) {
    return (
      <Box className="h-screen">
        <Head>
          <title>Atlas | Profile</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="The profile page for Atlas" />
        </Head>
        <TopNavbar />
        <Text className="m-8 text-center text-3xl font-semibold underline underline-offset-8">
          Profile
        </Text>
        <ProfileGrid session={session} studentId={session.user.id} />
      </Box>
    )
  }
}

export default ProfilePage
