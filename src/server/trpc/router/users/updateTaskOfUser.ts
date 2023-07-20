import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import taskCollection from '~/server/db/collections/TaskCollection'
import { Timestamp, runTransaction } from 'firebase/firestore'
import { db } from '~/server/db/firebase'
import type Task from '~/server/db/models/Task'
import { TRPCError } from '@trpc/server'

export const updateTaskOfUser = protectedProcedure
  .input(
    z.object({
      taskID: z.string(),
      status: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      await runTransaction(db, async (transaction) => {
        /// Get the user who is logged in and the task with the task id.
        const [user, currentTask] = await Promise.all([
          userCollection.withTransaction(transaction).get(ctx.session.user.id),
          taskCollection.withTransaction(transaction).get(input.taskID),
        ])

        /// If the user exists and the current task exist
        if (user && currentTask) {
          /// If the user has pending tasks to be completed
          if (user.pendingTask) {
            const taskIndex = user.pendingTask.findIndex((task) => task.id === input.taskID)

            /// We check whether the task that the user has the current task in his pending task.
            if (taskIndex !== -1) {
              const updatedPendingTasks = [...user.pendingTask]

              const taskToUpdate = updatedPendingTasks[taskIndex] as Task

              taskToUpdate.status = input.status

              /// If he has the current task in the pending task, we update it with the status of the input.
              userCollection.withTransaction(transaction).update({
                pendingTask: updatedPendingTasks
              }, user.id)

              /// We update the number of people who have completed the task by decrementing it by 1
              /// if there is a need to update it. We can also update the status once it is set to 0.
              if (currentTask.taskCompletion !== undefined) {
                currentTask.taskCompletion -= 1
  
                currentTask.status = currentTask.taskCompletion === 0 ? "Done" : currentTask.status

                taskCollection.withTransaction(transaction).update({
                  status: currentTask.status,
                  taskCompletion: currentTask.taskCompletion
                }, currentTask.id as string)
              }
            } else {
              throw new Error("The user does not have to complete the task.")
            }
          }
        }
      })
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'INFO',
        description: (e as Error).message,
        title: 'Update Task Status Failed',
      })

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message
      })
    }
  })
