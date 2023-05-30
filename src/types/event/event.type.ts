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
  attendees: number,
  endDate: Date
  id?: string
  invitedAttendees: {
    attended: boolean
    department: string
    name: string
    id: string
    role: string
  }[]
  name: string
  showup: number
  qr_code: string | undefined
  startDate: Date
}
