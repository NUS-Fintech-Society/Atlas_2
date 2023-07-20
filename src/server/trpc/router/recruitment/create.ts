import { runTransaction, Timestamp } from 'firebase/firestore'
import { z } from 'zod'
import { db } from '~/server/db/firebase'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import logCollection from '~/server/db/collections/LogCollection'
import { protectedProcedure } from '../../trpc'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'
import { addUsers } from '../users/createManyUsers'

export const createManyAppliedRoles = protectedProcedure
  .input(
    z.object({
      applicants: z.array(
        z.object({
          applicantId: z.string(),
          firstRole: z.string(),
          firstDepartment: z.string(),
          secondRole: z.string(),
          secondDepartment: z.string(),
        })
      ),
      users: z.array(
        z.object({
          department: z.string(),
          name: z.string(),
          nus_email: z.string(),
          role: z.string(),
          student_id: z.string(),
          personal_email: z.string(),
          resume: z
            .string()
            .optional()
            .transform((e) => (e === '' ? undefined : e)),
        }) // resume: to aid in applicants creation through csv upload
      ),
    })
  )
  .mutation(async ({ input }) => {
    try {
      return await runTransaction(db, async (transaction) => {
        input.users = input.users.filter(user => user.student_id)

        await addUsers(input.users, transaction)
        input.applicants.forEach((appliedRole) => {
          /// Upload first choice
          const id_one = appliedRoleCollection.generateRandomId()
          appliedRoleCollection.withTransaction(transaction).set({
            applicantId: appliedRole.applicantId,
            id: id_one,
            rank: 1,
            role: appliedRole.firstRole,
            department: appliedRole.firstDepartment,
            status: ApplicationStatus.PENDING,
            flag: false,
          }, id_one)

          /// Upload second choice
          const id_two = appliedRoleCollection.generateRandomId()
          appliedRoleCollection.withTransaction(transaction).set({
            applicantId: appliedRole.applicantId,
            rank: 2,
            id: id_two,
            role: appliedRole.secondRole,
            department: appliedRole.secondDepartment,
            status: ApplicationStatus.PENDING,
            flag: false,
          }, id_two)
        })
      })
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'WARNING',
        description: (e as Error).message,
        title: 'Error while creating multiple applied roles',
      })
    }
  })
