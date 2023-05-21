import Head from 'next/head'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import styled from '@emotion/styled'
import { useState } from 'react'
import SideCalendar from '~/components/calendar/SideCalendar'

// add styles as css
export const StyleWrapper = styled.div``

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
  const [events, useEvents] = useState([
    { title: 'event 1', start: '2023-05-01T15:30', end: '2023-05-01T16:30' },
    { title: 'event 2', start: '2023-05-02T06:00', end: '2023-05-02T07:00' },
  ])
  return (
    <>
      <Head>
        <title>Atlas | Calendar</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The calendar page for Atlas" />
      </Head>
      <TopNavbar isAdmin={session.isAdmin} />
      <div className="grid-container grid grid-cols-5">
        <SideCalendar meetings={meetings} />
        <StyleWrapper className="col-span-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: 'prev,today,next',
              center: 'dayGridMonth,timeGridWeek,timeGridDay',
              end: 'title',
            }}
            allDaySlot={false}
            events={events}
            eventClick={(info) => {
              alert('Event: ' + info.event.title)
            }}
          />
        </StyleWrapper>
      </div>
    </>
  )
}

export default withAuth(CalendarPage, true)
