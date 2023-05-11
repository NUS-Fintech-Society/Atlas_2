import Layout from '~/components/common/Layout'
import Head from 'next/head'
import DataTable from '~/components/users/Table'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth from '~/utils/withAuth'

const AdminUserPage = () => {
  return (
    <>
      <Head>
        <title>Atlas | Users</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <TopNavbar />
      <Layout>
        <DataTable />
      </Layout>
    </>
  )
}

export default withAuth(AdminUserPage, true)
