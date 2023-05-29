import { router } from '~/server/trpc/trpc'
import { getAllAttendance } from './getAllAttendance'
import { getAllAttendanceButSelf } from './getAllUsersButSelf'
import { createEvent } from './createEvent'

export const attendanceRouter = router({
  createEvent,
  getAllAttendance,
  getAllAttendanceButSelf,
})
