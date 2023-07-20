export type AppliedRole = {
  applicantId: string
  id?: string
  rank: Rank
  department: string
  interviewNotes?: string
  role: string
  status: ApplicationStatus
  flag: boolean
}

export enum ApplicationStatus {
  ACCEPTED = 'accepted',
  OFFERED = 'offered',
  PENDING = 'pending',
  INTERVIEWED = 'interviewed',
  REJECTED = 'rejected',
}

export enum Rank {
  FIRST = 1,
  SECOND = 2,
}
