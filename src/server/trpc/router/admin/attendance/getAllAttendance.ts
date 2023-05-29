import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import eventCollection from '~/server/db/collections/EventCollection'

export const getAllAttendance = protectedProcedure.query(async () => {
  try {
    const events = await eventCollection.queries([])
    return events.map((event) => {
      return {
        endDate: event.endDate.toDate(),
        id: event.id,
        name: event.name,
        startDate: event.startDate.toDate(),
        total_attendees: event.attendees.length,
        total_users: event.invitedAttendees.length,
      }
    })
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
