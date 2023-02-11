import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

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
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.event.create({
        data: {
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          // connect to existing departments
          departments: {
            connect: input.departments.map((name) => ({
              department_id: name,
            })),
          },
          // connect to existing user records
          attendees: {
            connect: input.attendees.map((attendee_id) => ({
              id: attendee_id,
            })),
          },
        },
      })
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
