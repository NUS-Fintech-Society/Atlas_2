import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import CreateMultipleApplicants from '~/components/recruitment/director/CreateMultipleApplicants'
import withAuth from '~/utils/withAuth'

const ApplicantsForm = () => {
  return (
    <>
      <Head>
        <title>Atlas | Create Users</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The create user page for Atlas" />
      </Head>
      <Box className="m-10">
        <h1 className="mb-5 text-center font-[Inter] text-4xl font-semibold">
          Create New Applicants
        </h1>
        <CreateMultipleApplicants />
      </Box>
    </>
  )
}

export default withAuth(ApplicantsForm, true)
