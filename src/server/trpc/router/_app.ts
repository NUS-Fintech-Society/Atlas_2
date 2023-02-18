import { router } from '../trpc'
import { authRouter } from './auth'
import { announcementRouter } from './admin/announcement'
import { memberRouter } from './member'
import { profileRouter } from './profile'
import { userRouter } from './admin/users'
import { eventRouter } from './event'

export const appRouter = router({
  auth: authRouter,
  announcement: announcementRouter,
  event: eventRouter,
  member: memberRouter,
  profile: profileRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
