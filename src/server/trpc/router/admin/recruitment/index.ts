import { router } from '~/server/trpc/trpc'
import { updateAppliedRoleStatus, updateInterviewNotes } from './update'

export const recruitmentRouter = router({
  updateAppliedRoleStatus,
  updateInterviewNotes,
})
