import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { UpdateEventController } from '../controllers/event/update_event_controller'
import { TRPCError } from '@trpc/server'

export const updateEvent = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      departments: z.array(z.string()),
      attendees: z.array(z.string()),
      isQrRequired: z.boolean(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const controller = new UpdateEventController()
      return await controller.execute(input, ctx.session.user.id)
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
