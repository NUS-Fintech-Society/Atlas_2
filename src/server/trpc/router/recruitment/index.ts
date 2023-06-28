import { router } from '~/server/trpc/trpc'
import {
  updateAppliedRoleStatus,
  updateInterviewNotes,
  updateAppliedRoleFlag,
} from './update'
import {
  getAllApplicantsTopRoleByDept,
  getApplicant,
  getAppliedRoleByRoleId,
  getAppliedRolesByApplicant,
} from './read'
import { createManyAppliedRoles } from './create'
import { getAllTasks } from './getAllTasks'
import { getAllTasksOfUser } from './getAllTasksOfUser'
import { createTask } from './createTask'

export const recruitmentRouter = router({
  updateAppliedRoleStatus,
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
})
