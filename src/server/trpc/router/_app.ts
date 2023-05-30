import { router } from '../trpc'
import { userRouter } from './users'
import { attendanceRouter } from './attendance'

export const appRouter = router({
  attendance: attendanceRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
