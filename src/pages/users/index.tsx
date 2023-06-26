import Head from 'next/head'
import DataTable from '~/components/users/Table'
import TopNavbar from '~/components/common/TopNavbar'
import { type BaseProps } from '~/utils/withAuth'
import { getSession } from 'next-auth/react'
import { type GetServerSidePropsContext } from 'next'

const AdminUserPage: React.FC<BaseProps> = ({ session }) => {
  return (
    <>
      <Head>
        <title>Atlas | Users</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <TopNavbar
        isAdmin={session.isAdmin}
        isApplicant={session.isApplicant}
        image={session.user?.image as string}
      />

      <DataTable />
    </>
  )
}

export default AdminUserPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  // If not logged in, redirect to the login page.
  // Otherwise, if he does not have admin access, redirect to the home page.
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
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
