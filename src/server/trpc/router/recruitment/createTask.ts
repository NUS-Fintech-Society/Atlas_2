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
      console.log("USER's name " + user.name)

      const taskID = 'TASK-' + taskCollection.generateRandomId()

      const pendingTask = {
        id: taskID,
        status: 'Incomplete',
        due: Timestamp.fromDate(input.due),
        taskName: input.taskName,
        description: input.description,
        department: input.departments,
        assignedUsers: users,
        taskCreatorId: ctx.session.user.id,
        taskCreatorName: user.name,
      }

      await taskCollection.set(pendingTask, taskID)

      const updateUserPromises = users.map(async (user) => {
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
      })

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
