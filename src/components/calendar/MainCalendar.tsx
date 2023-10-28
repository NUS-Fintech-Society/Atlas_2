import { Button, useDisclosure } from '@chakra-ui/react'
import styled from '@emotion/styled'
import type { EventClickArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid'
import { useState } from 'react'
import { ModalContext } from '~/context/ModalContext'
import { trpc } from '~/utils/trpc'
import CreateEventModal from './CreateEventModal'
import EventModal from './EventModal'

export const StyleWrapper = styled.div``

const MainCalendar = () => {
  const { data } = trpc.event.populateCalendar.useQuery()
  const { onOpen: onOpenDisplayEvent, isOpen: isOpenDisplayEvent, onClose: onCloseDisplayEvent } = useDisclosure()
  const { onOpen: onOpenCreateEvent, isOpen: isOpenCreateEvent, onClose: onCloseCreateEvent } = useDisclosure()

  const [displayEventId, setDisplayEventId] = useState<string>("")
  const [createEventId, setCreateEventId] = useState<string>("")


  const handleEventClick = (info: EventClickArg) => {
    setDisplayEventId(info.event.id)
    onOpenDisplayEvent()
  }

  const handleCreateEvent = () => {
    const uniqueId = Date.now().toString();
    setCreateEventId(uniqueId);
    onOpenCreateEvent();
  }

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
            onClick={handleCreateEvent}
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
          eventClick={handleEventClick}
        />
      </div>

      <ModalContext.Provider
        value={{
          isOpen: isOpenDisplayEvent,
          id: displayEventId,
          onClose: onCloseDisplayEvent,
        }}
      >
        <EventModal />
      </ModalContext.Provider>

      <ModalContext.Provider
        value={{
          isOpen: isOpenCreateEvent,
          id: createEventId,
          onClose: onCloseCreateEvent,
        }}
      >
        <CreateEventModal />
      </ModalContext.Provider>
    </StyleWrapper>
  )
}

export default MainCalendar
