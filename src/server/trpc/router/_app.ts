import { router } from '../trpc'
import { authRouter } from './auth'
import { announcementRouter } from './admin/announcement'
import { memberRouter } from './member'
import { profileRouter } from './profile'
import { userRouter } from './admin/users'
import { eventRouter } from './admin/events'
import { attendanceRouter } from './admin/attendance'

export const appRouter = router({
  auth: authRouter,
  announcement: announcementRouter,
  event: eventRouter,
  member: memberRouter,
  profile: profileRouter,
  user: userRouter,
  attendance: attendanceRouter,
})

export type AppRouter = typeof appRouter
