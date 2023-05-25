import { Attendance } from '@prisma/client'

export type EventInfos = {
  number: string
  name: string
  id: string
  total_users: string
  total_attendees: string
  startDate: string
  endDate: string
}

export interface BodyProps {
  _count: {
    Attendance: number
    attendees: number
  }
  attended: Set<string>
  name: string
  id: string
  attendees: {
    name: string | null
    department: string | null
    id: string
    role: string | null
  }[]
  endDate: Date
  hasStarted: boolean
  qr_code: string | null
  startDate: Date
}
