import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import userCollection from '~/server/db/collections/UserCollection'

export const getUserProfile = protectedProcedure
  .input(z.string())
  .query(async ({ ctx }) => {
    try {
      return await userCollection.getById(ctx.session.user.id)
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
