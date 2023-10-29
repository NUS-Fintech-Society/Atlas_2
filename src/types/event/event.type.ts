import type User from "~/server/db/models/Event"

export type EventInfos = {
  endDate: Date
  id: string | undefined
  name: string
  startDate: Date
  attendees: User[]
}

export interface BodyProps {
  attendees: number
  endDate: Date
  id?: string
  invitedAttendees: {
    attended: boolean | undefined
    department: string
    name: string
    id: string
    role: string | undefined
  }[]
  name: string
  showup: number
  qr_code: string | undefined
  startDate: Date
  departments: string[]
  description: string
}
