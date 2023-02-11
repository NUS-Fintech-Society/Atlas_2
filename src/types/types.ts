export type Project = {
  description: string
  difficulty: number
  rating: number
  departments?: string
  project_id: number
  name: string
  team_lead: string
  created_date: Date
  Departments?: Department
  users: User[]
}

export type Department = {
  department_id: string
  name: string
  roles: string[]
  eventId?: string
  announcements?: Announcement[]
  event?: Event
  projects?: Project[]
}

export type Announcement = {
  announcement_id: string
  content: string
  image?: string
  title: string
  updated_date: Date
  uploaded_date: Date
  department_id?: string
  userId: string
  department?: Department
  created_by: User
}

export type User = {
  attendance?: number | null
  batch?: string | null
  department?: string | null
  diet?: string | null
  discord?: string | null
  email: string
  faculty?: string | null
  gender?: string | null
  hashedPassword: string
  hobbies?: string | null
  id: string
  image?: string | null
  level: string
  linkedin?: string | null
  major?: string | null
  name?: string | null
  phone?: string | null
  personal_email?: string | null
  race?: string | null
  roles?: string | null
  shirt?: string | null
  telegram?: string | null
  total_events?: number | null
  wallet?: string | null
  year?: string | null
  date_of_birth?: Date | null
  eventId?: string | null
  announcements?: Announcement[] | null
  event?: Event | null
  projects?: Project[] | null
}

export type Event = {
  endDate: Date
  hasStarted: boolean
  name: string
  id: string
  qr_code?: string
  startDate: Date
  departments: Department[]
  attendees: User[]
}
