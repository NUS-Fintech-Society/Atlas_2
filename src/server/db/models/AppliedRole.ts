import type { ApplicationStatus } from '~/constant/applicationStatus'

export type AppliedRole = {
  applicantId: string
  id: string
  rank: 1 | 2 | 3
  department: string
  interviewNotes?: string
  role: string
  status: ApplicationStatus
}
