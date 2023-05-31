import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import type { ApplicationStatus } from '@prisma/client'

export const updateAppliedRoleStatus = protectedProcedure
  .input(
    z.object({
      appliedRoleId: z.string(),
      status: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const role = await ctx.prisma.appliedRole.update({
        where: {
          id: input.appliedRoleId,
        },
        data: {
          status: input.status as ApplicationStatus,
        },
      })
      return role
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })

export const updateInterviewNotes = protectedProcedure
  .input(
    z.object({
      applicantId: z.string(),
      interviewNotes: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const applicant = await ctx.prisma.user.update({
        where: {
          id: input.applicantId,
        },
        data: {
          interviewNotes: input.interviewNotes,
        },
      })
      return applicant
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
