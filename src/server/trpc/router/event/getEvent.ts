import { protectedProcedure } from '../../trpc'
import { router } from '~/server/trpc/trpc'
import { z } from 'zod'
import { toDataURL } from 'qrcode'
import { env } from '~/env/server.mjs'
import dayjs from 'dayjs'
import { TRPCError } from '@trpc/server'

/**
 * Toggles the event to start
 */
const startEvent = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    const eventId = input
    await ctx.prisma.event.update({
      where: { id: eventId },
      data: { hasStarted: true },
    })
  })

/**
 * Generates a QR code if the event exists
 *
 * @params Event ID from the event page
 * @throws TRPC Error if the Event ID does not exist
 * @returns The QR code base 64 string that can be parsed onto the frontend
 */
const getEvent = protectedProcedure
  .input(z.optional(z.string()))
  .query(async ({ ctx, input }) => {
    const [event, qrcode] = await Promise.all([
      ctx.prisma.event.findUnique({
        where: { id: input },
        select: {
          departments: {
            select: {
              name: true,
            },
          },
          endDate: true,
          hasStarted: true,
          startDate: true,
          name: true,
        },
      }),
      toDataURL(`${env.DOMAIN}/events/${input}`),
    ])

    // If there is no event, we return an empty object
    if (!event) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No such event exist',
      })
    }

    // Check if the event has ended
    const end = dayjs(event.endDate)
    const now = dayjs()
    if (now.isAfter(end)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'The event has already ended',
      })
    }

    return {
      departments: event.departments,
      hasStarted: event.hasStarted,
      name: event.name,
      qrcode,
      start: event.startDate,
    }
  })

export const eventRouter = router({
  getEvent,
  startEvent,
})
