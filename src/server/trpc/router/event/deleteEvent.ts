import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import eventCollection from '~/server/db/collections/EventCollection'
import { Timestamp } from 'firebase/firestore'
import logCollection from '~/server/db/collections/LogCollection'

export const deleteEvent = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      await eventCollection.delete(input.id)
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'INFO',
        description: (e as Error).message,
        title: 'Delete event failed',
      })
    }
  })
