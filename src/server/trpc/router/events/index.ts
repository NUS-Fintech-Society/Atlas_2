import { router } from '~/server/trpc/trpc'
import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { toDataURL } from 'qrcode'
import { randomUUID } from 'crypto'
import { LogType } from '@prisma/client'
import { ErrorTitle } from '../constants/ErrorTitle'
import { TRPCError } from '@trpc/server'
import { env } from '~/env/server.mjs'

const createEvent = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      departments: z.array(z.string()),
      attendees: z.array(z.string()),
      isQrRequired: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      let qr_code: string | undefined
      const id = randomUUID()

      if (input.isQrRequired) {
        qr_code = await toDataURL(`${env.VERCEL_URL}/events/${id}`)
      }

      await ctx.prisma.event.create({
        data: {
          attendees: {
            connect: input.attendees.map((attendee) => {
              return { id: attendee }
            }),
          },
          id,
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          qr_code,
        },
      })
    } catch (e) {
      await ctx.prisma.log.create({
        data: {
          message: (e as Error).message,
          title: ErrorTitle.ERROR_CREATING_EVENT,
          type: LogType.ERROR,
        },
      })
    }
  })

const getAllUsers = protectedProcedure.query(async ({ ctx }) => {
  try {
    const users = await ctx.prisma.user.findMany({
      select: {
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

const getEventInfo = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const [event, attendance] = await Promise.all([
        ctx.prisma.event.findUnique({
          where: { id: input },
          select: {
            attendees: {
              select: { name: true, department: true, roles: true, id: true },
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

const markAttendance = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    try {
      const user = ctx.session.user
      const result = await ctx.prisma.attendance.create({
        data: {
          id: user.id + input,
          eventId: input,
          userId: user.id,
        },
      })
      console.log('Success!', result)
    } catch (e) {
      await ctx.prisma.log.create({
        data: {
          type: LogType.ERROR,
          title: 'Error signing attendance',
          message: (e as Error).message,
        },
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })

export const eventRouter = router({
  createEvent,
  getAllUsers,
  getEvent,
  getEventInfo,
  markAttendance,
})
