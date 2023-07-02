import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import styled from '@emotion/styled'
import { trpc } from '~/utils/trpc'

export const StyleWrapper = styled.div``

const MainCalendar = () => {
  const { data } = trpc.event.populateCalendar.useQuery()

  return (
    <StyleWrapper className="col-span-4 mx-auto">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'prev,today,next',
          center: 'dayGridMonth,timeGridWeek,timeGridDay',
          end: 'title',
        }}
        allDaySlot={false}
        events={data || []}
        eventClick={(info) => {
          alert('Event: ' + info.event.title + '\n' + info.event.start + ' to\n' +  info.event.end)
        }}
      />
    </StyleWrapper>
  )
}

export default MainCalendar
