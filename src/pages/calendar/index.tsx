import Head from 'next/head'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import SideCalendar from '~/components/calendar/SideCalendar'
import MainCalendar from '~/components/calendar/MainCalendar'

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

const CalendarPage: React.FC<BaseProps> = ({ session }) => {
  return (
    <>
      <Head>
        <title>Atlas | Calendar</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The calendar page for Atlas" />
      </Head>
      <TopNavbar
        isAdmin={session.isAdmin}
        image={session.user?.image as string}
      />
      <div className="grid-container grid grid-cols-5">
        <SideCalendar meetings={meetings} />
        <MainCalendar />
      </div>
    </>
  )
}

export default withAuth(CalendarPage, true)
