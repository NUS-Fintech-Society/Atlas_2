import { router } from '~/server/trpc/trpc'
import getAllUsers from './read'

export const userRouter = router({
  getAllUsers,
})
