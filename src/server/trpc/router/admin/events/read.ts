import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export const getAllUsers = protectedProcedure.query(async ({ ctx }) => {
  try {
    const users = await ctx.prisma.user.findMany({
      select: {
        department: true,
        roles: true,
        name: true,
      },
    })
    return users
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
