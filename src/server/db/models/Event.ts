import type { Timestamp } from 'firebase/firestore'

type User = {
  id: string
  name: string
}

export type Event = {
  attendees: User[]
  endDate: Timestamp
  hasStarted: boolean
  id: string
  invitedAttendees: User[]
  name: string
  qrCode?: string
  startDate: Timestamp
}
