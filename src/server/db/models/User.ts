import type Task from './Task'

export type User = {
  department: string
  email: string
  isAdmin: boolean
  id: string
  name: string
  role: string
  pendingTask?: Task[]
  personal_email: string

  // Optional field: User can upload their image later.
  image?: string

  // Optional fields in create single user.
  batch?: string
  dietary?: string
  course?: string
  linkedin?: string
  phone?: string
  telegram?: string
  dob?: string // Store in DD-MM format so that we can get their birthday easily.
  shirtSize?: string
  discord?: string
  resume?: string // link to google drive due to google forms integration for recruitment
}
