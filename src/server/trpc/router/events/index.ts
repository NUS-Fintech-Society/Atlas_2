import { router } from '~/server/trpc/trpc'
import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

const getAllUsers = protectedProcedure.query(async ({ ctx }) => {
  try {
    return await ctx.prisma.user.findMany({
      select: {
        department: true,
        role: true,
        name: true,
        id: true,
      },
    })
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})

const getEventInfo = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const [event, attendance] = await Promise.all([
        ctx.prisma.event.findUnique({
          where: { id: input },
          select: {
            attendees: {
              select: { name: true, department: true, role: true, id: true },
            },
            _count: { select: { Attendance: true, attendees: true } },
            endDate: true,
            id: true,
            hasStarted: true,
            name: true,
            qr_code: true,
            startDate: true,
          },
        }),
        ctx.prisma.attendance.findMany({
          where: {
            eventId: input,
          },
        }),
      ])

      if (!event) {
        return null
      }

      const attended = new Set<string>()
      attendance.forEach((a) => attended.add(a.userId))

      return { ...event, attended }
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })

const getEvent = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const event = await ctx.prisma.event.findUnique({
        where: { id: input },
        select: {
          attendees: true,
          name: true,
          startDate: true,
          hasStarted: true,
        },
      })

      if (!event) {
        return null
      }

      const user = ctx.session.user

      const hasUserMarkedAttendance = await ctx.prisma.attendance.findFirst({
        where: {
          eventId: input,
          userId: user.id,
        },
      })

      const isAttendanceRequired =
        event.attendees.filter((attendee) => attendee.id === user.id).length > 0

      return {
        ...event,
        isAttendanceRequired,
        hasUserMarkedAttendance: hasUserMarkedAttendance !== null,
      }
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })

export const eventRouter = router({
  getAllUsers,
  getEvent,
  getEventInfo,
})
