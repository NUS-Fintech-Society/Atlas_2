import { AppliedRole } from "~/server/db/models/AppliedRole"

export type ApplicantWithAppliedRole = {
  id: string
  name: string
  interviewNotes: string | null
  appliedRoles: AppliedRole[]
}
