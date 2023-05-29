import { router } from '~/server/trpc/trpc'
import { getAllAttendance } from './getAllAttendance'
import { getAllAttendanceButSelf } from './getAllUsersButSelf'
import { createEvent } from './createEvent'
import { getEventInfo } from './getEventInfo'
import { markAttendance } from './markAttendance'

export const attendanceRouter = router({
  createEvent,
  getAllAttendance,
  getAllAttendanceButSelf,
  getEventInfo,
  markAttendance,
})
