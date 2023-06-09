import { router } from '~/server/trpc/trpc'
import { getAllAttendance } from './getAllAttendance'
import { getAllAttendanceButSelf } from './getAllUsersButSelf'
import { markAttendance } from './markAttendance'

export const attendanceRouter = router({
  getAllAttendance,
  getAllAttendanceButSelf,
  markAttendance,
})
