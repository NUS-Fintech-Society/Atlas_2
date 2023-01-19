import Buttons from '~/components/users/Buttons'
import UserTable from '~/components/users/UserTable'
import Layout from '~/components/common/Layout'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useRouter } from 'next/router'

export default function AdminUserPage() {
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()
  if (status === 'loading') return <LoadingScreen />
  if (session.level !== 'super') router.push('/users')

  return (
    <>
      <Layout>
        <div className="flex flex-col">
          <UserTable session={session} />
          <Buttons />
        </div>
      </Layout>
    </>
  )
}
