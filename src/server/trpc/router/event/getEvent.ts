import { protectedProcedure } from '../../trpc'
import { router } from '~/server/trpc/trpc'
import { z } from 'zod'
import { toDataURL } from 'qrcode'
import { env } from '~/env/server.mjs'

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
          startDate: true,
          name: true,
        },
      }),
      toDataURL(`${env.DOMAIN}/events/${input}`),
    ])

    if (!event) {
      return {
        departments: [''],
        name: '',
        qrcode: '',
        start: undefined,
      }
    }

    return {
      departments: event.departments,
      name: event.name,
      qrcode,
      start: event.startDate,
    }
  })

export const eventRouter = router({
  getEvent,
})
