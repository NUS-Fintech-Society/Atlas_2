import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import userCollection from '~/server/db/collections/UserCollection'

export const changePassword = protectedProcedure
  .input(
    z.object({
      oldPassword: z.string(),
      password: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { oldPassword, password } = input
      const { id } = ctx.session.user

      // Throw an error if we are unable to find the user
      const foundUser = await userCollection.getById(id)

      // Verify if the current password is correct
      // const success = await compare(oldPassword, foundUser.hashedPassword)
      // if (!success) {
      //   throw new TRPCError({
      //     code: 'UNAUTHORIZED',
      //     message: 'Incorrect password',
      //   })
      // }

      // await userCollection.update(id, {
      //   hashedPassword: newPassword,
      // })
    } catch (e) {
      // Throw an error if there is an issue with updating of password
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
