import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import userCollection from '~/server/db/collections/UserCollection'

export const getUserProfile = protectedProcedure
  .input(z.string())
  .query(async ({ input }) => {
    try {
      if (!input) return null
      return await userCollection.getById(input)
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
