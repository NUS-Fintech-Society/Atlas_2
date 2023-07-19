import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import userCollection from '~/server/db/collections/UserCollection'
import { where } from 'firebase/firestore'

export const getAllAttendanceButSelf = protectedProcedure.query(
  async ({ ctx }) => {
    try {
      const initialUsers = await userCollection.queries([
        where('id', '!=', ctx.session.user.id),
      ])

      const users = initialUsers.filter((user) => {
        return user.role !== 'Applicant' && user.department !== 'Unassigned'
      })

      return users.map((user) => {
        return {
          department: user.department,
          id: user.id as string,
          name: user.name,
          role: user.role,
        }
      })
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  }
)
