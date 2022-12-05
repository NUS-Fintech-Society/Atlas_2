import { router } from '~/server/trpc/trpc'
import createAnnouncements from './create'
import readAnnouncements from './read'

export const announcementRouter = router({
  createAnnouncements,
  readAnnouncements,
})
