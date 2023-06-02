import { router } from '~/server/trpc/trpc'
import { updateAppliedRoleStatus, updateInterviewNotes } from './update'
import { getAllApplicants, getApplicant, getAppliedRole } from './read'

export const recruitmentRouter = router({
  updateAppliedRoleStatus,
  updateInterviewNotes,
  getAllApplicants,
  getApplicant,
  getAppliedRole,
})
