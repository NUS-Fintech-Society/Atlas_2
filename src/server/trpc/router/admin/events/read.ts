import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const getAllUsers = protectedProcedure.query(async ({ ctx }) => {
  try {
    const users = await ctx.prisma.user.findMany({
      select: {
        // for display
        department: true,
        roles: true,
        name: true,
        id: true,
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

export const getEventInfo = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const event = await ctx.prisma.event.findUnique({ where: { id: input } })
      return event
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
