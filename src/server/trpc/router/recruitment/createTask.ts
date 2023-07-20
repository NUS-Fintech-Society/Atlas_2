import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import taskCollection from '~/server/db/collections/TaskCollection'
import { Timestamp } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import { runTransaction } from 'firebase/firestore'
import { db } from '~/server/db/firebase'
import { TRPCError } from '@trpc/server'

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
      await runTransaction(db, async (transaction) => {
        /// Get the users in the department and the information about the user who is creating the task.
        const [usersInDepartments, taskCreator] = await Promise.all([
          userCollection.findByDepartment(input.departments),
          userCollection.getById(ctx.session.user.id),
        ])

        /// Check whether the person creating the task has the permissions.
        if (!taskCreator.isAdmin) {
          throw Error('The user does not have the permission to create task.')
        }

        const taskID = 'TASK-' + taskCollection.generateRandomId()

        /// Update the pending task in the users in the department without administrative access.
        usersInDepartments.forEach((user) => {
          /// We do not assign pending task to admins
          if (!user.isAdmin) {
            const newPendingTask = {
              id: taskID,
              status: 'Incomplete',
              due: Timestamp.fromDate(input.due),
              taskName: input.taskName,
              description: input.description,
              department: input.departments,
              taskCreatorId: ctx.session.user.id,
              taskCreatorName: taskCreator.name,
            }

            if (user.pendingTask) {
              user.pendingTask.push(newPendingTask)
            } else {
              user.pendingTask = [newPendingTask]
            }

            userCollection.withTransaction(transaction).update(
              {
                pendingTask: user.pendingTask,
              },
              user.id as string
            )
          }
        })

        /// Add the pending task into the taskCollection
        const numberOfAdmins = usersInDepartments.filter(
          (user) => user.isAdmin
        ).length

        const taskCompletionCount = usersInDepartments.length - numberOfAdmins

        const pendingTask = {
          id: taskID,
          status: taskCompletionCount > 0 ? 'Incomplete' : 'Done',
          due: Timestamp.fromDate(input.due),
          taskName: input.taskName,
          description: input.description,
          department: input.departments,
          taskCreatorId: ctx.session.user.id,
          taskCreatorName: taskCreator.name,
          taskCompletion: taskCompletionCount, //Shows the number of users that has to complete the task
        }

        taskCollection.withTransaction(transaction).set(pendingTask, taskID)
      })
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'INFO',
        description: (e as Error).message,
        title: 'Create task failed',
      })

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
