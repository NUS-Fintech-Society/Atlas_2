import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import eventCollection from '~/server/db/collections/EventCollection'
import { toDataURL } from 'qrcode'
import { env } from '~/env/server.mjs'
import type { Timestamp } from 'firebase/firestore'

export const getEvent = protectedProcedure
  .input(z.string())
  .query(async ({ input }) => {
    try {
      if (!input) return
      const event = await eventCollection.getById(input)
      const attendees = event.invitedAttendees.filter(
        (attendee) => attendee.attended
      )

      //THIS QR CODE LEADS TO THE EVENT REGISTRATION
      // let qr_code = undefined
      // if (event.isQrRequired) {
      //   qr_code = await toDataURL(
      //     `${env.DOMAIN}/events/attendance/${event.id as string}`
      //   )
      // }

      return {
        attendees: attendees.length,
        endDate: (event.endDate as Timestamp).toDate(),
        id: event.id,
        invitedAttendees: event.invitedAttendees.map((attendee) => ({
          attended: attendee.attended,
          department: attendee.department,
          name: attendee.name,
          id: attendee.id,
          role: attendee.role,
        })),
        name: event.name,
        showup: event.attendees,
        // qr_code,
        departments: event.departments,
        startDate: (event.startDate as Timestamp).toDate(),
      }
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
