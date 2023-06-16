import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { toDataURL } from 'qrcode'
import { randomUUID } from 'crypto'
import { env } from '~/env/server.mjs'
import eventCollection from '~/server/db/collections/EventCollection'
import { Timestamp } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'

export const deleteEvent = protectedProcedure
    .input(z.object({
        id: z.string()
    }))
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