import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { toDataURL } from 'qrcode'
import { randomUUID } from 'crypto'
import { LogType } from '@prisma/client'

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
    try {
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
    } catch (e) {
      await ctx.prisma.log.create({
        data: {
          date: new Date(),
          message: (e as Error).message,
          title: 'ERROR CREATING EVENT',
          type: LogType.ERROR,
        },
      })
    }
  })
