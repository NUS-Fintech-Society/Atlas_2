import { router } from '~/server/trpc/trpc'
import { updateAppliedRoleStatus, updateInterviewNotes } from './update'
import { getAllApplicants, getApplicant } from './read'

export const recruitmentRouter = router({
  updateAppliedRoleStatus,
  updateInterviewNotes,
  getAllApplicants,
  getApplicant,
})
