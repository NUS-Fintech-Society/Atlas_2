import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { toDataURL } from 'qrcode'
import { randomUUID } from 'crypto'

export const createEvent = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      departments: z.array(z.string()),
      attendees: z.array(z.string()),
      isQrRequired: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    let qr_code: string | undefined
    const id = randomUUID()

    if (input.isQrRequired) {
      qr_code = await toDataURL(id)
    }

    await ctx.prisma.event.create({
      data: {
        attendees: {
          connect: input.attendees.map((attendee) => {
            return { id: attendee }
          }),
        },
        id: input.isQrRequired ? id : randomUUID(),
        name: input.name,
        startDate: input.startDate,
        endDate: input.endDate,
        qr_code,
      },
    })
  })
