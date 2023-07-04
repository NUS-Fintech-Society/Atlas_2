import { router } from '~/server/trpc/trpc'
import { getEvent } from './getEvent'
import { updateEvent } from './updateEvent'
import { deleteEvent } from './deleteEvent'
import { createEvent } from './createEvent'
import { getEventForUser } from './getEventForUser'
import { populateCalendar } from './populateCalendar'

export const eventRouter = router({
  populateCalendar,
  getEvent,
  updateEvent,
  deleteEvent,
  createEvent,
  getEventForUser,
})
