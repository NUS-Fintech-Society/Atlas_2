import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import eventCollection from '~/server/db/collections/EventCollection'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp } from 'firebase/firestore'

export const getEventForUser = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const event = await eventCollection.getById(input)
      const user = ctx.session.user

      // Check if the user is within the array of objects and whether the attended flag is true.
      let hasUserMarkedAttendance = false
      let isAttendanceRequired = false
      if (event.invitedAttendees) {
        hasUserMarkedAttendance =
          event.invitedAttendees.filter((attendee) => {
            return attendee.id === user.id && attendee.attended
          }).length === 1

        isAttendanceRequired =
          event.invitedAttendees.filter((attendee) => attendee.id === user.id)
            .length > 0
      }

      return {
        ...event,
        startDate: (event.startDate as Timestamp).toDate(),
        endDate: (event.endDate as Timestamp).toDate(),
        isAttendanceRequired,
        hasUserMarkedAttendance,
      }
    } catch (e) {
      await logCollection.add({
        level: 'WARNING',
        title: `Error marking attendance for ${ctx.session.user.name}`,
        description: (e as Error).message,
        createdAt: Timestamp.fromDate(new Date()),
      })
    }
  })
