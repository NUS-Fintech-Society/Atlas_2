export type User = {
  department: string
  email: string
  hashedPassword: string
  isAdmin: boolean
  id: string
  name: string
  role: string

  // Optional field: User can upload their image later.
  image?: string

  // Optional fields in create single user.
  batch?: string
  diet?: string
  course?: string
  linkedin?: string
  phone?: string
  telegram?: string
  dob?: string // Store in DD-MM format so that we can get their birthday easily.
}
