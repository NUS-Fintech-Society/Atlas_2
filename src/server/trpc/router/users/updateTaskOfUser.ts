import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import taskCollection from '~/server/db/collections/TaskCollection'
import { Timestamp } from 'firebase/firestore'
import { error } from 'console'
export const updateTaskOfUser = protectedProcedure
  .input(
    z.object({
      taskID: z.string(),
      status: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const user = await userCollection.findById(ctx.session.user.id)
      const currentTask = await taskCollection.findById(input.taskID)
      const taskCompletion = currentTask?.taskCompletion

      if (
        user !== undefined &&
        currentTask !== undefined &&
        currentTask !== null
      ) {
        if (user !== null && user.pendingTask !== undefined) {
          const task = user.pendingTask.find((task) => task.id === input.taskID)
          const taskIndex = user.pendingTask.findIndex(
            (task) => task.id === input.taskID
          )

          console.log(task)
          if (task !== undefined) {
            const updatedPendingTasks = [...user.pendingTask]
            const taskToUpdate = updatedPendingTasks[taskIndex]

            if (taskToUpdate !== undefined) {
              taskToUpdate.status = input.status
            } else {
              throw new Error('Task not found')
            }
            await userCollection.update(user.id, {
              pendingTask: updatedPendingTasks,
            })

            if (taskCompletion !== undefined) {
              await taskCollection.update(currentTask.id as string, {
                taskCompletion: taskCompletion - 1,
              })

              const updatedCompletionCount = taskCompletion - 1

              if (updatedCompletionCount == 0) {
                await taskCollection.update(currentTask.id as string, {
                  status: 'Done',
                })
              }
            }
          } else {
            throw new Error('Task not found')
          }
        } else {
          throw new Error('User or pendingTasks not found')
        }
      }
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'INFO',
        description: (e as Error).message,
        title: 'Update Task Status Failed',
      })
    }
  })
