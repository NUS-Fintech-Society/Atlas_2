import type { Timestamp } from 'firebase/firestore'

type User = {
  attended?: boolean
  completed?: boolean //For Tasks
  department: string
  id: string
  name: string
  role?: string
}

export type Event = {
  attendees: number
  endDate: Timestamp | Date
  hasStarted: boolean
  id?: string
  invitedAttendees: User[]
  name: string
  departments: string[]
  isQrRequired: boolean
  startDate: Timestamp | Date
}

export default User
