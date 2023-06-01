type Roles = {
  rank: 1 | 2 | 3
  department: string
  role: string
  status: 'accepted' | 'offered' | 'pending' | 'interviewed' | 'rejected'
  interviewNotes: string
}[]

export type AppliedRole = {
  email: string
  id?: string
  name: string
  roles: Roles
}
