import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import taskCollection from '~/server/db/collections/TaskCollection'
import { orderBy } from 'firebase/firestore'

export const getAllTasks = protectedProcedure.query(async () => {
  try {
    const tasks = await taskCollection.queries([orderBy('due')])
    return tasks.map((task) => {
      return {
        status: task.status,
        id: task.id,
        due: task.due.toDate(),
        taskName: task.taskName,
        description: task.description,
      }
    })
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
