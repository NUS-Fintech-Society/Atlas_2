import { router } from '~/server/trpc/trpc'
import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const getAllUsers = protectedProcedure.query(async ({ ctx }) => {
  try {
    const users = await ctx.prisma.user.findMany({
      select: {
        department: true,
        email: true,
        id: true,
        name: true,
        roles: true,
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

const getAllUsersForTable = protectedProcedure
  .input(
    z.object({
      pageIndex: z.number(),
      pageSize: z.number(),
    })
  )
  .query(async ({ ctx, input }) => {
    try {
      const users = await ctx.prisma.user.findMany({
        select: {
          department: true,
          email: true,
          id: true,
          name: true,
          roles: true,
        },
        skip: input.pageIndex * input.pageSize,
        take: input.pageSize,
      })

      const total = await ctx.prisma.user.count()
      const pageCount = Math.ceil(total / input.pageSize)

      return { users, pageCount }
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
})
