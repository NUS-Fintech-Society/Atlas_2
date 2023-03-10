import { router } from '~/server/trpc/trpc'
import { getAllUsers, getEvent } from './read'
import { createEvent } from './create'

export const eventRouter = router({
  createEvent,
  getEvent,
  getAllUsers,
})
