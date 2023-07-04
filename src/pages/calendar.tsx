import Head from 'next/head'
import withAuth from '~/utils/withAuth'
import MainCalendar from '~/components/calendar/MainCalendar'
import { getSession } from 'next-auth/react'
import { type GetServerSidePropsContext } from 'next'

const CalendarPage = () => {
  return (
    <>
      <Head>
        <title>Atlas | Calendar</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The calendar page for Atlas" />
      </Head>
      <div className="grid-container grid-cols-5">
        <MainCalendar />
      </div>
    </>
  )
}

export default withAuth(CalendarPage, false)

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
        destination: '/status',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
