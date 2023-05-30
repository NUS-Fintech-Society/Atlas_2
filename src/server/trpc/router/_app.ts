import { router } from '../trpc'
import { recruitmentRouter } from './recruitment'
import { userRouter } from './users'
import { attendanceRouter } from './attendance'

export const appRouter = router({
  attendance: attendanceRouter,
  recruitment: recruitmentRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
