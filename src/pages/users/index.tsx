import Layout from '~/components/common/Layout'
import Head from 'next/head'
import DataTable from '~/components/users/Table'

const SEO = () => {
  return (
    <Head>
      <title>Atlas | Users</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="The login page for Atlas" />
    </Head>
  )
}

export default function AdminUserPage() {
  return (
    <>
      <SEO />
      <Layout>
        <DataTable />
      </Layout>
    </>
  )
}
