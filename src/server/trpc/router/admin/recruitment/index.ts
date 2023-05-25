import { router } from '~/server/trpc/trpc'
import { updateAppliedRoleStatus, updateInterviewNotes } from './update'
import { getAllApplicants, getApplicant, getAppliedRole } from './read'
import { createSingleApplicant } from './create'

export const recruitmentRouter = router({
  updateAppliedRoleStatus,
  updateInterviewNotes,
  getAllApplicants,
  getApplicant,
  getAppliedRole,
  createSingleApplicant,
})
