import { router } from '~/server/trpc/trpc'
import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { resetPassword } from './post'
import { getAllUsersForTable } from './getAllUsersForTable'

const getAllUsers = protectedProcedure.query(async ({ ctx }) => {
  try {
    const users = await ctx.prisma.user.findMany({
      select: {
        department: true,
        email: true,
        id: true,
        name: true,
        role: true,
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

export const userRouter = router({
  getAllUsers,
  getAllUsersForTable,
  resetPassword,
})
