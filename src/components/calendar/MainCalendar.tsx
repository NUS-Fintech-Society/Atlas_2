// import FullCalendar from '@fullcalendar/react' // must go before plugins
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import timeGridPlugin from '@fullcalendar/timegrid'
import styled from '@emotion/styled'
import { useState } from 'react'

export const StyleWrapper = styled.div``

const MainCalendar = () => {
  const [events, useEvents] = useState([
    { title: 'event 1', start: '2023-05-01T15:30', end: '2023-05-01T16:30' },
    { title: 'event 2', start: '2023-05-02T06:00', end: '2023-05-02T07:00' },
  ])

  return (
    <StyleWrapper className="col-span-4">
      {/* <FullCalendar
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
      /> */}
    </StyleWrapper>
  )
}

export default MainCalendar
