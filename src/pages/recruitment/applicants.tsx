import { Text } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '~/components/common/Layout'
import TopNavbar from '~/components/common/TopNavbar'
import SearchBar from '~/components/common/SearchBar'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import ApplicantGrid from '~/components/recruitment/ApplicantGrid'
import InfoPopup from '~/components/recruitment/InfoPopup'

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
        <ApplicantGrid />
        <InfoPopup />
      </Layout>
    </>
  )
}

export default withAuth(ApplicantsPage, true)
