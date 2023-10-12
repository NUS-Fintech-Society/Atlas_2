import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import eventCollection from '~/server/db/collections/EventCollection'
import dayjs from 'dayjs'
import type { Timestamp } from 'firebase/firestore'

export const populateCalendar = protectedProcedure.query(async () => {
  try {
    // Get all the events 
    const events = await eventCollection.queries()
    return events.map((event) => {
      return {
        id: event.id,
        title: event.name,
        start: dayjs((event.startDate as Timestamp).toDate()).format('YYYY-MM-DDTHH:mm'),
        end: dayjs((event.endDate as Timestamp).toDate()).format('YYYY-MM-DDTHH:mm'),
      }
    })
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
