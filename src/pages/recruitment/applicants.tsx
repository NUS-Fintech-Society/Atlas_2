import { Box, Text } from '@chakra-ui/react'
import Head from 'next/head'
import SearchBar from '~/components/common/SearchBar'
import withAuth from '~/utils/withAuth'
import ApplicantGrid from '~/components/recruitment/director/ApplicantGrid'
import SearchProvider from '~/context/recruitment/SearchProvider'

const ApplicantsPage = () => {
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
      <Box position="relative" mt="10" mb="10">
        <Text className="text-center text-4xl font-bold">Applicants</Text>
        <SearchProvider>
          <SearchBar />
          <ApplicantGrid />
        </SearchProvider>
      </Box>
    </>
  )
}

export default withAuth(ApplicantsPage, true)
