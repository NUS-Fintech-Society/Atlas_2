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
      const hasUserMarkedAttendance =
        event.invitedAttendees.filter((attendee) => {
          return attendee.id === user.id && attendee.attended
        }).length === 1

      // Check whether the user is within the array of objects.
      const isAttendanceRequired =
        event.invitedAttendees.filter((attendee) => attendee.id === user.id)
          .length > 0

      return {
        ...event,
        isAttendanceRequired,
        hasUserMarkedAttendance: hasUserMarkedAttendance !== null,
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
