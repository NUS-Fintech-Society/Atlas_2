import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'

export const getAllUsersForTable = protectedProcedure
  .input(
    z.object({
      pageIndex: z.number(),
      pageSize: z.number(),
    })
  )
  .query(async ({ input }) => {
    // TODO: Fix up the pagination logic
    try {
      const users = (await userCollection.queries([])).map((user) => {
        return {
          department: user.department,
          email: user.email,
          id: user.id as string,
          name: user.name,
          role: user.role,
        }
      })

      const total = await userCollection.count()
      const pageCount = Math.ceil(total.data().count / input.pageSize)

      return { users, pageCount }
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
