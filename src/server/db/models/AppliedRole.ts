import type { User } from './User'

export type AppliedRole = {
  rank: number
  department: string
  role: string
  status: ApplicationStatus
  applicant: User
}

export enum ApplicationStatus {
  ACCEPTED = 'Accepted',
  OFFERED = 'Offered',
  PENDINGREVIEW = 'Pending Review',
  INTERVIEWED = 'Interviewed',
  REJECTED = 'Rejected',
}
