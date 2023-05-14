import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export const getAllAttendance = protectedProcedure.query(async ({ ctx }) => {
  try {
    const queries = await ctx.prisma.event.findMany({
      select: {
        name: true,
        startDate: true,
        endDate: true,
        id: true,
        _count: {
          select: { Attendance: true, attendees: true },
        },
      },
    })

    return queries.map((query) => {
      return {
        endDate: query.endDate,
        name: query.name,
        id: query.id,
        startDate: query.startDate,
        total_attendees: query._count.Attendance,
        total_users: query._count.attendees,
      }
    })
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
