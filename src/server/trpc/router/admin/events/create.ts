import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const createEvent = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      date: z.date(),
      departments: z.array(z.string()),
      attendees: z.array(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.event.create({
        //create a new row in the table
        data: {
          name: input.name,
          date: input.date,
          departments: input.departments,
          attendees: input.attendees,
        },
      })
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
