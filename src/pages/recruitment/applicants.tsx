import { Text } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '~/components/common/Layout'
import TopNavbar from '~/components/common/TopNavbar'
import SearchBar from '~/components/common/SearchBar'
import withAuth, { type BaseProps } from '~/utils/withAuth'

const ApplicantsPage: React.FC<BaseProps> = ({ session }) => {
  return (
    <>
      <Head>
        <title>Atlas | Applicants </title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="The applicants page for Atlas recruitment"
        />
      </Head>
      <TopNavbar isAdmin={session.isAdmin} />
      <Layout>
        <Text className="text-center text-4xl font-bold">Applicants</Text>
        <SearchBar />
      </Layout>
    </>
  )
}

export default withAuth(ApplicantsPage, true)
