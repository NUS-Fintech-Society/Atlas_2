import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'

export const getAllTasksOfUser = protectedProcedure.query(async ({ ctx }) => {
  try {
    const userId = ctx.session.user.id
    const user = await userCollection.getById(userId)

    return user.pendingTask?.map((task) => {
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
