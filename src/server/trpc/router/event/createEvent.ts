import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import eventCollection from '~/server/db/collections/EventCollection'
import { Timestamp } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'

export const createEvent = protectedProcedure
  .input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
      name: z.string(),
      venue: z.string(),
      description: z.string(),
      departments: z.array(z.string()),
      invitedAttendees: z.array(z.string()),
      secretCode: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const eventID = 'EVENT-' + eventCollection.generateRandomId()

      const users = await Promise.all(
        input.invitedAttendees.map(async (attendee) => {
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

      await eventCollection.set(
        {
          startDate: Timestamp.fromDate(input.startDate),
          endDate: Timestamp.fromDate(input.endDate),
          name: input.name,
          venue: input.venue,
          description: input.description,
          departments: input.departments,
          isExclusive: false,
          hasStarted: false,
          attendees: 0,
          invitedAttendees: users,
          secretCode: input.secretCode,
        },
        eventID
      )
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'INFO',
        description: (e as Error).message,
        title: 'Create event failed',
      })
    }
  })
