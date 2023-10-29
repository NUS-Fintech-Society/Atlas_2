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
    id?: string
    startDate: Timestamp | Date
    endDate: Timestamp | Date
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

export default User
