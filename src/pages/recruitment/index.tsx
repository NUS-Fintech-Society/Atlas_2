import Head from 'next/head'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import { Text } from '@chakra-ui/react'

const RecruitmentPage: React.FC<BaseProps> = ({ session }) => {
  return (
    <>
      <Head>
        <title>Atlas | Recruitment</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The recruitment page for Atlas" />
      </Head>
      <TopNavbar image={session.user?.image as string} isAdmin={session.isAdmin} />
      <Text className="text-center text-4xl font-bold">Recruitment</Text>
    </>
  )
}

export default withAuth(RecruitmentPage, true)
