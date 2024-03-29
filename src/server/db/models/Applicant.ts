import type { AppliedRole } from './AppliedRole'

// Not in firestore collection, piggybacks off User model
export type Applicant = {
  id: string
  email: string
  name: string
  resume?: string
  appliedRoles: AppliedRole[]
}
