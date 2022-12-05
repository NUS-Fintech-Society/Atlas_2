import { router } from '~/server/trpc/trpc'
import createAnnouncements from './create'

export const announcementRouter = router({
  createAnnouncements,
})
