import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import eventCollection from '~/server/db/collections/EventCollection'
import { Timestamp } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'

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
  .mutation(async ({ input }) => {
    try {
      const users = await Promise.all(
        input.attendees.map(async (attendee) => {
          const data = await userCollection.getById(attendee)
          return {
            name: data.name,
            id: data.id as string,
            attended: false,
            department: data.department,
            role: data.role,
          }
        })
      )

      await eventCollection.update(input.id, {
        attendees: 0,
        endDate: Timestamp.fromDate(input.endDate),
        hasStarted: false,
        invitedAttendees: users,
        name: input.name,
        departments: input.departments,
        isQrRequired: input.isQrRequired,
        startDate: Timestamp.fromDate(input.startDate),
      })
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'INFO',
        description: (e as Error).message,
        title: 'Update event failed',
      })
    }
  })
