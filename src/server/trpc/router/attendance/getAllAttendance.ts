import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import eventCollection from '~/server/db/collections/EventCollection'
import type { Timestamp } from 'firebase/firestore'

export const getAllAttendance = protectedProcedure.query(async () => {
  try {
    const events = await eventCollection.queries([])
    return events.map((event) => {
      return {
        endDate: (event.endDate as Timestamp).toDate(),
        id: event.id,
        name: event.name,
        startDate: (event.startDate as Timestamp).toDate(),
        attendees: event.invitedAttendees
      }
    })
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
