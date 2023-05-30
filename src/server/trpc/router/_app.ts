import { router } from '../trpc'
import { memberRouter } from './member'
import { userRouter } from './users'
import { attendanceRouter } from './attendance'

export const appRouter = router({
  attendance: attendanceRouter,
  member: memberRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
