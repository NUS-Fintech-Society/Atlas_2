import Head from 'next/head'
import withAuth from '~/utils/withAuth'
import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'

const RecruitmentPage = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Atlas | Recruitment</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The recruitment page for Atlas" />
      </Head>
      <Box className="m-10">
        <Text className="text-center text-4xl font-bold">Recruitment</Text>
        <div className="px-2 sm:px-6 sm:pt-5 md:px-20 md:pt-5 lg:px-28 lg:pt-5">
          <div className="gap x-2 my-20 mx-20 grid grid-cols-1 place-items-center gap-y-10 lg:my-10 lg:grid-cols-3 ">
            <Button
              bgColor="#97AEFF"
              width={230}
              className="mb-10 text-black"
              onClick={() => router.push('/recruitment/create')}
            >
              Create Applicants
            </Button>
            <Button
              bgColor="#97AEFF"
              width={230}
              className="mb-10 text-black"
              onClick={() => router.push('/recruitment/members')}
            >
              View Department Members
            </Button>
            <Button
              bgColor="#97AEFF"
              width={230}
              className="mb-10 text-black"
              onClick={() => router.push('/recruitment/applicants')}
            >
              Manage Applicants
            </Button>
          </div>
        </div>
      </Box>
    </>
  )
}

export default withAuth(RecruitmentPage, true)

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
