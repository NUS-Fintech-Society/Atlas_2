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
    .input(z.string())
    .query(async ({ input }) => {
        try {
            if (!input) return
                await eventCollection.delete(input)
            } catch (e) {
                await logCollection.add({
                    createdAt: Timestamp.fromDate(new Date()),
                    level: 'INFO',
                    description: (e as Error).message,
                    title: 'Delete event failed',
                })
            }
    })