import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { CreateManyUserController } from '../controllers/users/create_many_user_controller'

export const createManyUsers = protectedProcedure
  .input(
    z.array(
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
    )
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const controller = new CreateManyUserController()
      return await controller.execute(input, ctx.session.user.email as string)
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message
      })
    }
  })
