import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const deleteMemberImage = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    try {
      const user = await ctx.prisma.user.update({
        where: {
          id: input,
        },
        data: {
          image: '',
        },
      })
      return user
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'ERROR DELETING IMAGE' + error,
      })
    }
  })
