import SingleUserForm from '~/components/users/SingleUserForm'
import dynamic from 'next/dynamic'
const CreateMultipleUsers = dynamic(
  () => import('~/components/users/CreateMultipleUsers')
)
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Head from 'next/head'
import withAuth from '~/utils/withAuth'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'

const UserForm = () => {
  return (
    <>
      <Head>
        <title>Atlas | Create Users</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The create user page for Atlas" />
      </Head>
      <div className="m-auto w-[90%]">
        {/* Heading */}
        <h1 className="mb-5 font-[Inter] text-4xl font-semibold">
          Create User / Users
        </h1>

        <Tabs>
          <TabList>
            <Tab>Create Single User</Tab>
            <Tab>Create Multiple Users</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SingleUserForm />
            </TabPanel>
            <TabPanel>
              <CreateMultipleUsers />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  )
}

export default withAuth(UserForm, true)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  // If not logged in, redirect to the login page.
  // If he is an applicant, redirect him to the applicant page.
  // If he does not have admin access, redirect to the home page.
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
        destination: '/application-status',
        permanent: false,
      },
    }
  } else if (!session.isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
