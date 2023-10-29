import { BaseCollection } from './BaseCollection'

type User = {
  attended?: boolean
  completed?: boolean //For Tasks
  department: string
  id?: string
  name: string
  role?: string
}

export type Event = {
    id?: string
    startDate: FirebaseFirestore.Timestamp | Date
    endDate: FirebaseFirestore.Timestamp | Date
    name: string
    description: string
    venue: string
    departments: string[]
    isExclusive: boolean  
    hasStarted: boolean
    attendees: number
    invitedAttendees: User[]
    secretCode: string   
}

class EventCollection extends BaseCollection<Event> {
  protected collectionName = 'events'
  protected objectName = 'event'
}

export const eventCollection = new EventCollection()
