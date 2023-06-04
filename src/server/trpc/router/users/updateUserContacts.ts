import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'

export const updateUserContacts = protectedProcedure
  .input(
    z.object({
      studentId: z.string(),
      telegram: z.string(),
      discord: z.string(),
      personal_email: z.string(),
      email: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return await userCollection.update(ctx.session.user.id, {
      email: input.email,
    })
  })
