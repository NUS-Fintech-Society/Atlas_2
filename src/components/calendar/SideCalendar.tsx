import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  getDay,
  format,
  parseISO,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from 'date-fns'
import { useState } from 'react'
import Meeting from './Meeting'

export type Meeting = {
  id: number
  title: string | null
  start: string
  end: string
}

export type Meetings = {
  meetings: Meeting[]
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SideCalendar({ meetings }: Meetings) {

  

  
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  const selectedDayMeetings = meetings?.filter((meeting) =>
    isSameDay(parseISO(meeting.start), selectedDay)
  )

  return (
    <div className="col-span-1 bg-zinc-900 pt-16">
      <div className="mx-auto max-w-md px-4 sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:grid md:grid-rows-2">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto text-4xl font-semibold text-white">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="mt-2 grid grid-cols-7 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    'py-1.5'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={classNames(
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        'text-red-500',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-900',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-400',
                      isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        'bg-blue-400',
                      !isEqual(day, selectedDay) && 'hover:bg-yellow-400',
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        'font-semibold',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                    )}
                  >
                    <time
                      className="text-white"
                      dateTime={format(day, 'yyyy-MM-dd')}
                    >
                      {format(day, 'd')}
                    </time>
                  </button>

                  <div className="mx-auto mt-1 h-1 w-1">
                    {meetings?.some((meeting) =>
                      isSameDay(parseISO(meeting.start), day)
                    ) && (
                      <div className="h-1 w-1 rounded-full bg-violet-700"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <section className="divide-y divide-gray-400">
            <h2 className="text-center font-semibold text-blue-700">
              {isSameDay(today, selectedDay) ? 'TODAY ' : ''}
              <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                {format(selectedDay, 'dd/LL/yyyy')}
              </time>
            </h2>
            <ol className="text-sm leading-6 text-gray-500">
              {selectedDayMeetings?.length > 0 ? (
                selectedDayMeetings?.map((meeting) => (
                  <Meeting meeting={meeting} key={meeting.id} />
                ))
              ) : (
                <p>No meetings for today.</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]
