import Head from 'next/head'
import withAuth from '~/utils/withAuth'
import SideCalendar from '~/components/calendar/SideCalendar'
import MainCalendar from '~/components/calendar/MainCalendar'
import { getSession } from 'next-auth/react'
import { type GetServerSidePropsContext } from 'next'

const meetings = [
  {
    id: 1,
    title: 'Meeting 1',
    start: '2023-05-11T13:00',
    end: '2023-05-11T14:30',
  },
  {
    id: 2,
    title: 'Meeting 2',
    start: '2023-05-20T09:00',
    end: '2023-05-20T11:30',
  },
  {
    id: 3,
    title: 'Meeting 3',
    start: '2023-05-20T17:00',
    end: '2023-05-20T18:30',
  },
  {
    id: 4,
    title: 'Meeting 4',
    start: '2023-06-09T13:00',
    end: '2023-06-09T14:30',
  },
  {
    id: 5,
    title: 'Meeting 5',
    start: '2023-05-13T14:00',
    end: '2023-05-13T14:30',
  },
]

const CalendarPage = () => {
  return (
    <>
      <Head>
        <title>Atlas | Calendar</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The calendar page for Atlas" />
      </Head>
      <div className="grid-container grid grid-cols-5">
        <SideCalendar meetings={meetings} />
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
        destination: '/application-status',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
