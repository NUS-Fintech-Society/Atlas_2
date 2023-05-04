import SingleUserForm from '~/components/users/SingleUserForm'
import dynamic from 'next/dynamic'
const CreateMultipleUsers = dynamic(
  () => import('~/components/users/CreateMultipleUsers')
)
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useRouter } from 'next/router'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Head from 'next/head'
import TopNavbar from '~/components/common/TopNavbar'

const UserForm = () => {
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (!session.isAdmin) {
    router.push('/')
  }

  // Required to prevent this page from showing to the user early
  if (session.isAdmin) {
    return (
      <>
        <Head>
          <title>Atlas | Create Users</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="The create user page for Atlas" />
        </Head>
        <TopNavbar isAdmin={session.isAdmin} />
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
}

export default UserForm
