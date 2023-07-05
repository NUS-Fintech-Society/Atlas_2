import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import userCollection from '~/server/db/collections/UserCollection'

export const getAllUsersForTable = protectedProcedure.query(async () => {
  try {
    const users = (await userCollection.queries([])).map((user) => {
      return {
        department: user.department,
        email: user.email,
        id: user.id as string,
        name: user.name,
        role: user.role,
        isAdmin: user.isAdmin,
      }
    })

    return users
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
