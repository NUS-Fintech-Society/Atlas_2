import { Box, Text } from '@chakra-ui/react'
import { type Session } from 'next-auth'
import Head from 'next/head'
import React from 'react'
import TopNavbar from '~/components/common/TopNavbar'
import ProfileGrid from '~/components/profile/ProfileGrid'
import withAuth from '~/utils/withAuth'

interface ProfilePageProps {
  session: Session
}

const ProfilePage: React.FC<ProfilePageProps> = ({ session }) => {
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
      <ProfileGrid session={session} studentId={session?.user?.id as string} />
    </Box>
  )
}

export default withAuth(ProfilePage)
