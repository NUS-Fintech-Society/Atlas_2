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
  .mutation(async ({ ctx, input }) => {
    await userCollection.update(ctx.session.user.id, {
      department: input.department,
      name: input.name,
      role: input.role,
    })
  })
