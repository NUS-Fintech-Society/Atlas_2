import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import { sendOfferEmail, sendRejectionEmail } from './helper'
import userCollection from '~/server/db/collections/UserCollection'
import { runTransaction } from 'firebase/firestore'
import { db } from '~/server/db/firebase'

/**
 * Update the applicant's role in the user collection.
 * Update the status in the applied_roles collection.
 * If the new status is accepted or rejected, we send an email.
 *
 * @param applicantId
 * @param status
 * @param appliedRoleId
 * @returns
 */
function updateStatusAndRole(
  applicantId: string,
  status: ApplicationStatus,
  appliedRoleId: string
) {
  return runTransaction(db, async (transaction) => {
    const [appliedRole, applicant] = await Promise.all([
      appliedRoleCollection
        .withTransaction(transaction)
        .get(appliedRoleId),
      userCollection
        .withTransaction(transaction)
        .get(applicantId)
    ])

    if (applicant.department !== "Unassigned" || applicant.role !== "Applicant") {
      throw Error("The applicant has already accepted a role.")
    }

    appliedRoleCollection
      .withTransaction(transaction)
      .update({ status }, appliedRoleId)

    if (status === ApplicationStatus.ACCEPTED) {
      const isAdmin =
        appliedRole.role === 'Co-Director' ||
        appliedRole.role === 'Director' ||
        appliedRole.department === 'Internal Affairs'

      userCollection
        .withTransaction(transaction)
        .update({
          isAdmin,
          role: appliedRole.role,
          department: appliedRole.department,
        }, applicantId)

      await sendOfferEmail(
        applicant.email, 
        applicant.name, 
        appliedRole.role, 
        appliedRole.department
      )
    } else if (status === ApplicationStatus.REJECTED) {
      await sendRejectionEmail(
        applicant.email,
        applicant.name,
        appliedRole.role,
        appliedRole.department
      )
    }
  })
}

export const updateAppliedRoleStatus = protectedProcedure
  .input(
    z.object({
      appliedRoleId: z.string(),
      applicantId: z.string(),
      status: z.nativeEnum(ApplicationStatus),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { applicantId, appliedRoleId, status } = input

      await updateStatusAndRole(applicantId, status, appliedRoleId)
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

export const updateAppliedRoleFlag = protectedProcedure
  .input(
    z.object({
      appliedRoleId: z.string(),
      flag: z.boolean(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      return await appliedRoleCollection.update(input.appliedRoleId, {
        flag: input.flag,
      })
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
