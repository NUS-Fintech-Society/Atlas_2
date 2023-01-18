import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { compare, hash } from 'bcryptjs'

export default protectedProcedure
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
      const foundUser = await ctx.prisma.user.findUnique({
        where: { id },
        select: { hashedPassword: true },
      })

      if (!foundUser) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Oops, something went wrong!',
        })
      }

      // Verify if the current password is correct
      const success = await compare(oldPassword, foundUser.hashedPassword)
      if (!success) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Incorrect password',
        })
      }

      const newPassword = await hash(password, 10)
      await ctx.prisma.user.update({
        data: { hashedPassword: newPassword },
        where: { id },
      })
    } catch (e) {
      // Throw an error if there is an issue with updating of password
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
