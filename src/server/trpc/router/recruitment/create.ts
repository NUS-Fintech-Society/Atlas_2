import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import logCollection from '~/server/db/collections/LogCollection'
import { protectedProcedure } from '../../trpc'
import { appliedRoleCollection } from '~/server/db/collections/admin/AppliedRoleCollection'
import { addUsers } from '../users/createManyUsers'
import { db } from '~/server/db/admin_firebase'

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
      return await db.runTransaction(async (transaction) => {
        // Filter away the empty rows
        input.users = input.users.filter((user) => user.student_id)

        const usersCreated = await addUsers(input.users, transaction)

        input.applicants = input.applicants.filter((applicant) =>
          usersCreated.includes(applicant.applicantId)
        )

        input.applicants.forEach((appliedRole) => {
          /// Upload first choice
          appliedRoleCollection.withTransaction(transaction).set({
            applicantId: appliedRole.applicantId,
            rank: 1,
            role: appliedRole.firstRole,
            department: appliedRole.firstDepartment,
            status: ApplicationStatus.PENDING,
            flag: false,
          })

          /// Upload second choice
          appliedRoleCollection.withTransaction(transaction).set({
            applicantId: appliedRole.applicantId,
            rank: 2,
            role: appliedRole.secondRole,
            department: appliedRole.secondDepartment,
            status: ApplicationStatus.PENDING,
            flag: false,
          })
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
