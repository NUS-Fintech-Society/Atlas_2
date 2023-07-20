import { BaseCollection } from './BaseCollection'

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
  endDate: FirebaseFirestore.Timestamp | Date
  hasStarted: boolean
  id?: string
  invitedAttendees: User[]
  name: string
  departments: string[]
  isQrRequired: boolean
  startDate: FirebaseFirestore.Timestamp | Date
}

class EventCollection extends BaseCollection<Event> {
  protected collectionName = 'events'
  protected objectName = 'event'
}

export const eventCollection = new EventCollection()
