import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import taskCollection from '~/server/db/collections/TaskCollection'
import { orderBy } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'

export const getAllTasks = protectedProcedure.query(async ({ ctx }) => {
  try {
    const tasks = await taskCollection.queries([orderBy('due')])

    const user = await userCollection.findById(ctx.session.user.id)

    if (!user) {
      throw new Error('User not found')
    }

    const filteredTasks = tasks.filter((task) =>
      task.department.includes(user.department)
    )

    return filteredTasks.map((task) => {
      return {
        status: task.status,
        id: task.id,
        due: task.due.toDate(),
        taskName: task.taskName,
        description: task.description,
        taskCreator: task.taskCreator,
      }
    })
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
