import Buttons from '~/components/admin/Buttons'
import UserTable from '~/components/admin/UserTable'
import Layout from '~/components/common/Layout'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useRouter } from 'next/router'
import Head from 'next/head'

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
      <Head>
        <title>Atlas | Users</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <Layout>
        <div className="flex flex-col">
          <UserTable session={session} />
          <Buttons />
        </div>
      </Layout>
    </>
  )
}
