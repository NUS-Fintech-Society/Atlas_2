import Layout from '~/components/common/Layout'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useRouter } from 'next/router'
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
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (session.level !== 'super') {
    router.push('/users')
  }

  return (
    <>
      <SEO />
      <Layout>
        <div className="flex flex-col">
          <DataTable />
        </div>
      </Layout>
    </>
  )
}
