import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'

export const updateUserProfile = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
      department: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      // Check whether the user has permissions.
      const user = await userCollection.getById(ctx.session.user.id)
      if (!user.isAdmin) {
        throw new Error('User does not have permission to edit.')
      }

      await userCollection.update(input.id, {
        department: input.department,
        name: input.name,
        role: input.role,
      })
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
