import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { randomUUID } from 'crypto'
import type { User } from '~/types/types'

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
      // convert attendees (array of string id) to User
      const attendees: User[] = []
      console.log('Attendees: ', input.attendees)
      for (const attendeeId of input.attendees) {
        console.log('Attendee: ', attendeeId)
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: attendeeId,
          },
        })
        attendees.push(user)
      }

      await ctx.prisma.event.create({
        //create a new row in the table
        data: {
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          id: randomUUID(), // not sure why need to give input when @default prisma
          departments: {
            createMany: {
              data: input.departments.map((dept) => ({
                department_id: dept,
                name: dept,
                roles: [],
                projects: [],
              })),
            },
          },
          attendees: {
            createMany: {
              data: attendees,
            },
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
