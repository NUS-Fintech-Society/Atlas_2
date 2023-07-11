import { Box, Text } from '@chakra-ui/react'
import Head from 'next/head'
import withAuth from '~/utils/withAuth'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'
import MemberGrid from '~/components/recruitment/director/MemberGrid'
import MemberSearchProvider from '~/context/recruitment/MemberSearchProvider'
import MemberSearchBar from '~/components/recruitment/director/MemberSearchBar'

const MembersPage = () => {
  return (
    <>
      <Head>
        <title>Atlas | Members </title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="The members page for your department"
        />
      </Head>
      <Box position="relative" mt="10" mb="10">
        <Text className="text-center text-4xl font-bold">Members</Text>
        <MemberSearchProvider>
          <MemberSearchBar />
          <MemberGrid />
        </MemberSearchProvider>
      </Box>
    </>
  )
}

export default withAuth(MembersPage, true)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  } else if (session.isApplicant) {
    return {
      redirect: {
        destination: '/status',
        permanent: false,
      },
    }
  } else if (!session.isAdmin) {
    return {
      redirect: {
        destination: '/calendar',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
