import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure } from '~/server/trpc/trpc'

export const getAllApplicants = protectedProcedure.query(async ({ ctx }) => {
  try {
    return await ctx.prisma.user.findMany({
      where: {
        level: 'applicant',
      },
      select: {
        id: true,
        name: true,
        interviewNotes: true,
        appliedRoles: true,
      },
    })
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error retrieving applicants: ' + error,
    })
  }
})

export const getApplicant = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input,
        },
        select: {
          name: true,
          interviewNotes: true,
          appliedRoles: true,
        },
      })
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error retrieving applicants: ' + error,
      })
    }
  })

export const getAppliedRole = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      return await ctx.prisma.appliedRole.findUnique({
        where: {
          id: input,
        },
        select: {
          rank: true,
          departmentId: true,
          role: true,
          status: true,
        },
      })
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error retrieving applicants: ' + error,
      })
    }
  })
