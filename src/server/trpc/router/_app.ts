import { router } from '../trpc'
import { userRouter } from './users'
import { attendanceRouter } from './attendance'
import { recruitmentRouter } from './recruitment'
import { eventRouter } from './event'

export const appRouter = router({
  attendance: attendanceRouter,
  recruitment: recruitmentRouter,
  user: userRouter,
  event: eventRouter,
})

export type AppRouter = typeof appRouter
