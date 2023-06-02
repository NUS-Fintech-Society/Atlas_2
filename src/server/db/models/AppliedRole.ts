export type AppliedRole = {
  applicantId: string
  id: string
  rank: 1 | 2 | 3
  department: string
  interviewNotes?: string
  role: string
  status: ApplicationStatus
}

export enum ApplicationStatus {
  ACCEPTED = 'accepted',
  OFFERED = 'offered',
  PENDING = 'pending',
  INTERVIEWED = 'interviewed',
  REJECTED = 'rejected',
}
