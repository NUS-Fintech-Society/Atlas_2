import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'

export const updateUserImage = protectedProcedure
  .input(
    z.object({
      image: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    await userCollection.update(ctx.session.user.id, {
      image: input.image,
    })
  })
