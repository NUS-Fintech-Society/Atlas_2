import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import styled from '@emotion/styled'
import { Button } from '@chakra-ui/react'
import { trpc } from '~/utils/trpc'

export const StyleWrapper = styled.div``

const MainCalendar = () => {
  const { data } = trpc.event.populateCalendar.useQuery()

  return (
    <StyleWrapper className="col-span-4 mx-auto">
      <div className="px-2 sm:px-6 sm:pt-5 md:px-20 md:pt-5 lg:px-28 lg:pt-5">
        <h1 className="prose mb-5 py-3 text-4xl font-semibold">
          Event Calendar Overview
        </h1>

        <div className="text-right">
          <Button
            bgColor="#0C1747"
            width={215}
            className="mb-10 text-white"
            type="submit"
            onClick={() => alert('Create an Event Modal (Pop-Up)')}
          >
            Create Event
          </Button>
        </div>

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
        />
      </div>
    </StyleWrapper>
  )
}

export default MainCalendar
