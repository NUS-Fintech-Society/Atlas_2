import { ApplicationStatus, LogType } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { protectedProcedure } from '~/server/trpc/trpc'
import { ErrorTitle } from '../constants/ErrorTitle'

export const createSingleApplicant = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      email: z.string(),
      password: z.string(),
      name: z.string(),
      firstRole: z.string(),
      firstDepartmentId: z.string(),
      secondRole: z.string(),
      secondDepartmentId: z.string(),
      thirdRole: z.string(),
      thirdDepartmentId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const hashedPassword = await hash(input.password, 10)
    try {
      await ctx.prisma.user.create({
        data: {
          id: input.id,
          email: input.email,
          hashedPassword,
          name: input.name,
          role: 'Applicant',
          appliedRoles: {
            create: [
              {
                id: input.id,
                rank: 1,
                departmentId: input.firstDepartmentId,
                role: input.firstRole,
                status: ApplicationStatus.PENDINGREVIEW,
              },
              {
                id: input.id,
                rank: 2,
                departmentId: input.secondDepartmentId,
                role: input.secondRole,
                status: ApplicationStatus.PENDINGREVIEW,
              },
              {
                id: input.id,
                rank: 3,
                departmentId: input.thirdDepartmentId,
                role: input.thirdRole,
                status: ApplicationStatus.PENDINGREVIEW,
              },
            ],
          },
        },
      })
    } catch (e) {
      await ctx.prisma.log.create({
        data: {
          message: (e as Error).message,
          title: ErrorTitle.ERROR_CREATING_SINGLE_APPLICANT,
          type: LogType.ERROR,
        },
      })
    }
  })
