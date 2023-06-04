import { Menu } from '@headlessui/react'
import { format, parseISO } from 'date-fns'
import { DotsVerticalIcon } from '@heroicons/react/outline'

export type Meeting = {
  id: number
  title: string | null
  start: string
  end: string
}
export type meeting = {
  meeting: Meeting
}

function combineClasses(classes: string[]) {
  return classes.join('')
}

export default function Meeting({ meeting }: meeting) {
  const startDateTime = parseISO(meeting.start)
  const endDateTime = parseISO(meeting.end)

  return (

    <li className="group flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-green-400 hover:bg-green-400">
      <div className="flex-auto text-white">
        <p className="font-bold">{meeting.title}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.start}>
            {format(startDateTime, 'h:mm a')}
          </time>{' '}
          - <time dateTime={meeting.end}>{format(endDateTime, 'h:mm a')}</time>
        </p>
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="h-6 w-6" aria-hidden="true" />
          </Menu.Button>
        </div>
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={combineClasses(
                    ['block px-4 py-2 text-sm'].concat(
                      active ? 'bg-gray-100 text-black' : 'text-gray-900'
                    )
                  )}
                  onClick={() => {
                    alert('You want to edit meeting')
                  }}
                >
                  Edit Meeting
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={combineClasses(
                    ['block px-4 py-2 text-sm'].concat(
                      active ? 'bg-gray-100 text-black' : 'text-gray-900'
                    )
                  )}
                  onClick={() => {
                    alert('You want to cancel meeting')
                  }}
                >
                  Cancel Meeting
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </li>
  )
}
