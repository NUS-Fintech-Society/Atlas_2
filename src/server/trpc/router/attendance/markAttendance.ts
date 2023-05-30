import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import eventCollection from '~/server/db/collections/EventCollection'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp } from 'firebase/firestore'

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
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'WARNING',
        title: 'Error marking attendance',
        description: (e as Error).message,
      })
    }
  })
