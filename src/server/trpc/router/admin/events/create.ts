import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

export const createEvent = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      departments: z.array(z.string()),
      attendees: z.array(z.string()),
    })
  )
  .mutation(async ({ input }) => {
    const prisma = new PrismaClient()

    await prisma.event.create({
      data: {
        attendees: {
          connect: input.attendees.map((attendee) => {
            return { id: attendee }
          }),
        },
        name: input.name,
        startDate: input.startDate,
        endDate: input.endDate,
      },
    })
  })
