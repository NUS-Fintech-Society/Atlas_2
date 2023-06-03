import type { Timestamp } from 'firebase/firestore'

type User = {
  attended: boolean
  department: string
  id: string
  name: string
  role: string
}

export type Event = {
  attendees: number
  endDate: Timestamp
  hasStarted: boolean
  id?: string
  invitedAttendees: User[]
  name: string
  qrCode: boolean
  startDate: Timestamp
}
