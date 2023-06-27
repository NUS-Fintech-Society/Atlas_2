import Head from 'next/head'
import DataTable from '~/components/users/Table'
import withAuth from '~/utils/withAuth'
import { getSession } from 'next-auth/react'
import { type GetServerSidePropsContext } from 'next'

const AdminUserPage = () => {
  return (
    <>
      <Head>
        <title>Atlas | Users</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <DataTable />
    </>
  )
}

export default withAuth(AdminUserPage, true)

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
