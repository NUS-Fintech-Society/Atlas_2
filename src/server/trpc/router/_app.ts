import { router } from '../trpc'
import { memberRouter } from './member'
import { profileRouter } from './profile'
import { userRouter } from './users'
import { attendanceRouter } from './attendance'

export const appRouter = router({
  attendance: attendanceRouter,
  member: memberRouter,
  profile: profileRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
