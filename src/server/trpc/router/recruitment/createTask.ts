import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import taskCollection from '~/server/db/collections/TaskCollection'
import { Timestamp } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import type Task from '~/server/db/models/Task'

export const createTask = protectedProcedure
  .input(
    z.object({
      taskName: z.string(),
      due: z.date(),
      departments: z.array(z.string()),
      description: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const users = await userCollection.findByDepartment(input.departments)
      const user = await userCollection.getById(ctx.session.user.id)

      const taskID = 'TASK-' + taskCollection.generateRandomId()

      let numberOfAdmins = 0

      const updateUserPromises = users.map(async (user) => {
        if (user.isAdmin) {
          numberOfAdmins++
        } else {
          //We do not assign pending task to admins
          const newPendingTask = {
            id: taskID,
            status: 'Incomplete',
            due: Timestamp.fromDate(input.due),
            taskName: input.taskName,
            description: input.description,
            department: input.departments,
            taskCreatorId: ctx.session.user.id,
            taskCreatorName: user.name,
          }

          let updatedPendingTasks: Task[] = []

          if (user.pendingTask) {
            updatedPendingTasks = [...user.pendingTask, newPendingTask]
          } else {
            updatedPendingTasks = [newPendingTask]
          }

          return userCollection.update(user.id, {
            pendingTask: updatedPendingTasks,
          })
        }
      })

      //We exclude the taskCreator and all admins in that department in the taskCount
      const taskCompletionCount = users.length - numberOfAdmins

      const pendingTask = {
        id: taskID,
        status: 'Incomplete',
        due: Timestamp.fromDate(input.due),
        taskName: input.taskName,
        description: input.description,
        department: input.departments,
        // assignedUsers: users, (Hidden so that the collection does not store who was being assigned since data is not useful and optimised)
        taskCreatorId: ctx.session.user.id,
        taskCreatorName: user.name,
        taskCompletion: taskCompletionCount, //Shows the number of users that has to complete the task
      }

      await taskCollection.set(pendingTask, taskID)

      await Promise.all(updateUserPromises)
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'INFO',
        description: (e as Error).message,
        title: 'Create task failed',
      })
    }
  })
