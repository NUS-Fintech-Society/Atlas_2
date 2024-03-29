import { Box, Text } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import ProfileGrid from '~/components/profile/ProfileGrid'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'

const ProfilePage: React.FC<BaseProps> = ({ session }) => {
  return (
    <Box className="h-screen">
      <Head>
        <title>Atlas | Profile</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The profile page for Atlas" />
      </Head>

      <Text className="m-8 text-center text-4xl font-semibold underline-offset-8">
        Profile
      </Text>
      <ProfileGrid studentId={session?.user?.id as string} />
    </Box>
  )
}

export default withAuth(ProfilePage, false)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
