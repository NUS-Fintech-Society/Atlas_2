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
  name: string
  id: string
  attendees: {
    name: string | null
    department: string | null
    id: string
    roles: string | null
  }[]
  endDate: Date
  hasStarted: boolean
  qr_code: string | null
  startDate: Date
}
