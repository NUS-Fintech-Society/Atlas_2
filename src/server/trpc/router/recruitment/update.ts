import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import userCollection from '~/server/db/collections/UserCollection'

export const updateAppliedRoleStatus = protectedProcedure
  .input(
    z.object({
      applicantId: z.string(),
      appliedRoleId: z.string(),
      status: z.nativeEnum(ApplicationStatus),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const res = await appliedRoleCollection.update(input.appliedRoleId, {
        status: input.status,
      })
      if (input.status == ApplicationStatus.ACCEPTED) {
        updateAcceptedApplicant(input.applicantId, input.appliedRoleId)
      }
      return res
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
      appliedRoleId: z.string(),
      interviewNotes: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      return await appliedRoleCollection.update(input.appliedRoleId, {
        interviewNotes: input.interviewNotes,
      })
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })

// update the current User model's department and role as the applicant is now a FTS member
const updateAcceptedApplicant = async (
  applicantId: string,
  appliedRoleId: string
) => {
  const appliedRole = await appliedRoleCollection.findById(appliedRoleId)
  const user = await userCollection.update(applicantId, {
    department: appliedRole?.department,
    role: appliedRole?.role,
  })
  return user
}
