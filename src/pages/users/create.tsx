import SingleUserForm from '~/components/users/SingleUserForm'
import dynamic from 'next/dynamic'
const CreateMultipleUsers = dynamic(
  () => import('~/components/users/CreateMultipleUsers')
)
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Head from 'next/head'

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

export default UserForm
