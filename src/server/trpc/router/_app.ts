import { router } from '../trpc'
import { authRouter } from './auth'
import { memberRouter } from './member'
import { profileRouter } from './profile'
import { userRouter } from './admin/users'
import { eventRouter } from './events'
import { attendanceRouter } from './admin/attendance'
import { recruitmentRouter } from './admin/recruitment'

export const appRouter = router({
  auth: authRouter,
  event: eventRouter,
  member: memberRouter,
  profile: profileRouter,
  user: userRouter,
  attendance: attendanceRouter,
  recruitment: recruitmentRouter,
})

export type AppRouter = typeof appRouter
