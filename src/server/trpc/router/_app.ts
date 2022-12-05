import { router } from '../trpc'
import { authRouter } from './auth'
import { announcementRouter } from './admin/announcement'

export const appRouter = router({
  auth: authRouter,
  announcement: announcementRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
