import { useDisclosure } from '@chakra-ui/react'
import type { EventClickArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import styled from '@emotion/styled'
import { ModalContext } from '~/context/ModalContext'
import { Button } from '@chakra-ui/react'
import { trpc } from '~/utils/trpc'
import EventModal from './EventModal'
import { useState } from 'react'

export const StyleWrapper = styled.div``

const MainCalendar = () => {
  const { data } = trpc.event.populateCalendar.useQuery()
  const { onOpen, isOpen, onClose } = useDisclosure()

  const [id, setId] = useState<string>('')

  const handleEventClick = (info: EventClickArg) => {
    setId(info.event.id)
    onOpen()
  }

  return (
    <StyleWrapper className="col-span-4 mx-auto">
      <div className="px-2 sm:px-6 sm:pt-5 md:px-20 md:pt-5 lg:px-28 lg:pt-5">
        <h1 className="prose mb-5 py-3 text-4xl font-semibold">
          Events Overview
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
            start: 'title',
            center: 'dayGridMonth,timeGridWeek,timeGridDay',
            end: 'prev,today,next',
          }}
          allDaySlot={false}
          events={data || []}
          eventClick={handleEventClick}
        />
      </div>

      <ModalContext.Provider
        value={{
          isOpen,
          id,
          onClose,
        }}
      >
        <EventModal />
      </ModalContext.Provider>
    </StyleWrapper>
  )
}

export default MainCalendar
