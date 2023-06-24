import { router } from '../trpc'
import { userRouter } from './users'
import { attendanceRouter } from './attendance'
import { recruitmentRouter } from './recruitment'

export const appRouter = router({
  attendance: attendanceRouter,
  recruitment: recruitmentRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
