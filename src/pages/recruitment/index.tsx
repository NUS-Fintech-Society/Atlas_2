import Head from 'next/head'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const RecruitmentPage: React.FC<BaseProps> = ({ session }) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Atlas | Recruitment</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The recruitment page for Atlas" />
      </Head>
      <TopNavbar isAdmin={session.isAdmin} image={session.user?.image as string} />
      <Box className="m-10">
        <Text className="text-center text-4xl font-bold">Recruitment</Text>
        <div className="px-2 sm:px-6 sm:pt-5 md:px-20 md:pt-5 lg:px-28 lg:pt-5">
          <div className="my-20 mx-20 grid grid-cols-1 place-items-center gap-y-10 lg:my-10 lg:grid-cols-2 ">
            <Button
              bgColor="#97AEFF"
              width={215}
              className="mb-10 text-black"
              onClick={() => router.push('/recruitment/create')}
            >
              Create Applicants
            </Button>
            <Button
              bgColor="#97AEFF"
              width={215}
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
