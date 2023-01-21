import { router } from '~/server/trpc/trpc'
import { getAllUsers } from './read'
import { createEvent } from './create'

export const eventRouter = router({
  createEvent,
  getAllUsers,
})
