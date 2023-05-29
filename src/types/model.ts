import type { AppliedRole } from '@prisma/client'

export type ApplicantWithAppliedRole = {
  id: string
  name: string
  interviewNotes: string | null
  appliedRoles: AppliedRole[]
}
