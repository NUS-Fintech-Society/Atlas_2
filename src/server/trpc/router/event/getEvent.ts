import { protectedProcedure } from '../../trpc'
import { router } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { toDataURL } from 'qrcode'

/**
 * Generates a QR code if the event exists
 *
 * @params Event ID from the event page
 * @throws TRPC Error if the Event ID does not exist
 * @returns The QR code base 64 string that can be parsed onto the frontend
 */
const getEvent = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    // Run these 2 events synchronously to save time
    const [event, qrcode] = await Promise.all([
      ctx.prisma.event.findUnique({
        where: { id: input },
      }),
      toDataURL('www.google.com'),
    ])

    if (!event) {
      return ''
    }
    return qrcode
  })

export const eventRouter = router({
  getEvent,
})
