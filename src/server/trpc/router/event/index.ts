import { router } from '~/server/trpc/trpc'
import { getEvent } from './getEvent'
import { updateEvent } from './updateEvent'
import { deleteEvent } from './deleteEvent'
import { createEvent } from './createEvent' 
import { getEventForUser } from './getEventForUser'

export const eventRouter = router({
    getEvent,
    updateEvent,
    deleteEvent,
    createEvent,
    getEventForUser,
})

