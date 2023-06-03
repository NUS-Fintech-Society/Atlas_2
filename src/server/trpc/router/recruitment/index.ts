import { router } from '~/server/trpc/trpc'
import { updateAppliedRoleStatus, updateInterviewNotes } from './update'
import {
  getAllApplicantsTopRoleByDept,
  getApplicant,
  getAppliedRole,
} from './read'

export const recruitmentRouter = router({
  updateAppliedRoleStatus,
  updateInterviewNotes,
  getAllApplicantsTopRoleByDept,
  getApplicant,
  getAppliedRole,
})
