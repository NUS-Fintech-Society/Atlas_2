import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'

export const getUserImage = protectedProcedure
  .input(z.string())
  .query(async ({ input }) => {
    return (await userCollection.getById(input)).image
  })
