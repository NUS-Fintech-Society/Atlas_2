import { router } from '~/server/trpc/trpc'
import {
  updateAppliedRoleStatus,
  updateAppliedRoleStatusWithEmail,
  updateInterviewNotes,
  updateAppliedRoleFlag,
} from './update'
import {
  getAllApplicantsTopRoleByDept,
  getApplicant,
  getAppliedRoleByRoleId,
  getAppliedRolesByApplicant,
  getAllDeptMembers,
} from './read'
import { createManyAppliedRoles } from './create'
import { getAllTasks } from './getAllTasks'
import { getAllTasksOfUser } from './getAllTasksOfUser'
import { createTask } from './createTask'

export const recruitmentRouter = router({
  updateAppliedRoleStatus,
  updateAppliedRoleStatusWithEmail,
  updateInterviewNotes,
  updateAppliedRoleFlag,
  getAllApplicantsTopRoleByDept,
  getApplicant,
  getAppliedRoleByRoleId,
  createManyAppliedRoles,
  getAllTasks,
  createTask,
  getAllTasksOfUser,
  getAppliedRolesByApplicant,
  getAllDeptMembers,
})
