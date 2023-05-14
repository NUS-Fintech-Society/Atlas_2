import { router } from '~/server/trpc/trpc'
import { getAllUsers, getEventInfo } from './read'
import { createEvent } from './create'

export const eventRouter = router({
  createEvent,
  getAllUsers,
  getEventInfo,
})
