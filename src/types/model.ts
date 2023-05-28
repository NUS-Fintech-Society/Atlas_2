import type { AppliedRole } from '@prisma/client'

export type ApplicantWithAppliedRole = {
  id: string
  name: string | null
  interviewNotes: string | null
  appliedRoles: AppliedRole[]
}
