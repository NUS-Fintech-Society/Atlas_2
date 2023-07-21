import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'
import logCollection from '~/server/db/collections/LogCollection'
import { protectedProcedure } from '../../trpc'
import { CreateManyAppliedRoleController } from '../controllers/recruitment/create_many_applied_roles_controller'

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
  .mutation(async ({ input: { users, applicants }, ctx }) => {
    try {
      const contoller = new CreateManyAppliedRoleController()
      return await contoller.execute(applicants, users, ctx.session.user.email as string)
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'WARNING',
        description: (e as Error).message,
        title: 'Error while creating multiple applied roles',
      })
    }
  })
