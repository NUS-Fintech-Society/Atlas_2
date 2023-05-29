import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import eventCollection from '~/server/db/collections/EventCollection'

/**
 * @param {string} id The event id
 */
export const getEventInfo = protectedProcedure
  .input(z.string())
  .query(async ({ input }) => {
    try {
      const event = await eventCollection.getById(input)
      console.log('The event is ', event)

      return {
        attendees: event.attendees,
        endDate: event.endDate.toDate(),
        id: event.id,
        invitedAttendees: event.invitedAttendees,
        name: event.name,
        showup: event.attendees.length,
        qr_code: event.qrCode,
        startDate: event.startDate.toDate(),
      }
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
