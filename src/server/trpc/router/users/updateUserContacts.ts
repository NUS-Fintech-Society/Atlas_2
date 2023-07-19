import { where } from 'firebase/firestore'
import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import userCollection from '~/server/db/collections/UserCollection'
import { TRPCError } from '@trpc/server'
import type { User } from '~/server/db/models/User'

export const updateUserContacts = protectedProcedure
  .input(
    z.object({
      dietary: z.string(),
      discord: z.string(),
      email: z.string(),
      linkedin: z.string(),
      shirtSize: z.string().toUpperCase(),
      telegram: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Need to check whether the email exist because we are using it to login.
    const users = await userCollection.queries([
      where('email', '==', input.email),
    ])

    if (users.length && (users[0] as User).id !== ctx.session.user.id) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email already exists!',
      })
    }

    return await userCollection.update(ctx.session.user.id, {
      dietary: input.dietary || '',
      discord: input.discord || '',
      email: input.email,
      shirtSize: input.shirtSize || '',
      linkedin: input.linkedin || '',
      telegram: input.telegram || '',
    })
  })
