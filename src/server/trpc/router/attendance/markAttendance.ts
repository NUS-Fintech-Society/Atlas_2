import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { LogType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import eventCollection from '~/server/db/collections/EventCollection'

export const markAttendance = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    try {
      const user = ctx.session.user
      const event = await eventCollection.getById(input)
      event.invitedAttendees = event.invitedAttendees.map((attendee) => {
        if (attendee.id === user.id) {
          attendee.attended = true
        }
        return attendee
      })

      await eventCollection.update(input, {
        attendees: event.attendees + 1,
        invitedAttendees: event.invitedAttendees,
      })
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
