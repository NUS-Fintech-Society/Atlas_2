import { router } from '~/server/trpc/trpc'
import { getAllAttendance } from './read'

export const attendanceRouter = router({
  getAllAttendance,
})
