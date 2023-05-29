import { router } from '../trpc'
import { authRouter } from './users/auth'
import { memberRouter } from './member'
import { profileRouter } from './profile'
import { userRouter } from './admin/users'
import { attendanceRouter } from './attendance'

export const appRouter = router({
  attendance: attendanceRouter,
  auth: authRouter,
  member: memberRouter,
  profile: profileRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
