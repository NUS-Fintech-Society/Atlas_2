import { router } from '~/server/trpc/trpc'
import { getAllAttendance } from './getAllAttendance'

export const attendanceRouter = router({
  getAllAttendance,
})
