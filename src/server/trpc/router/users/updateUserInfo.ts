import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'

export const updateUserInfo = protectedProcedure
  .input(
    z.object({
      studentId: z.string(),
      telegram: z.string(),
      shirtSize: z.string().toUpperCase(),
      linkedin: z.string(),
      discord: z.string(),
      dietary: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    return await userCollection.update(input.studentId, {
      shirtSize: input.shirtSize,
      linkedin: input.linkedin,
      telegram: input.telegram,
      discord: input.discord,
      dietary: input.dietary,
    })
  })
