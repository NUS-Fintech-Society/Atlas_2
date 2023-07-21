import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import {
  sendAcceptanceEmail,
  sendOfferEmail,
  sendRejectionEmail,
} from './helper'
import userCollection from '~/server/db/collections/UserCollection'
import { runTransaction } from 'firebase/firestore'
import { db } from '~/server/db/firebase'
import { Actor } from '~/constant/actor'

/**
 * Update the applicant's role in the user collection.
 * Update the status in the applied_roles collection.
 * If the new status is accepted, offered or rejected, we send an email.
 *
 * @param applicantId
 * @param status
 * @param appliedRoleId
 * @returns
 */
function updateStatusAndRole(
  applicantId: string,
  status: ApplicationStatus,
  appliedRoleId: string,
  actor: Actor
) {
  return runTransaction(db, async (transaction) => {
    const [appliedRole, applicant] = await Promise.all([
      appliedRoleCollection.withTransaction(transaction).get(appliedRoleId),
      userCollection.withTransaction(transaction).get(applicantId),
    ])

    if (
      applicant.department !== 'Unassigned' ||
      applicant.role !== 'Applicant'
    ) {
      throw Error('The applicant has already accepted a role.')
    }

    appliedRoleCollection
      .withTransaction(transaction)
      .update({ status }, appliedRoleId)

    switch (actor) {
      case Actor.DIRECTOR:
        // If director offers, sends offer email to applicant
        if (status === ApplicationStatus.OFFERED) {
          await sendOfferEmail(
            applicant.personal_email,
            applicant.name,
            appliedRole.role,
            appliedRole.department
          )
          // If director rejects, sends rejection email to applicant
        } else if (status === ApplicationStatus.REJECTED) {
          await sendRejectionEmail(
            applicant.personal_email,
            applicant.name,
            appliedRole.role,
            appliedRole.department
          )
        }
        break
      // If applicant accepts, applicant themselves receives an acceptance email as offical welcome to society
      case Actor.APPLICANT:
        if (status === ApplicationStatus.ACCEPTED) {
          // Update role and dept of applicant to accepted role
          userCollection.withTransaction(transaction).update(
            {
              role: appliedRole.role,
              department: appliedRole.department,
            },
            applicantId
          )

          await sendAcceptanceEmail(
            applicant.personal_email,
            applicant.name,
            appliedRole.role,
            appliedRole.department
          )
        } else if (status === ApplicationStatus.REJECTED) {
          await sendRejectionEmail(
            applicant.personal_email,
            applicant.name,
            appliedRole.role,
            appliedRole.department
          )
        }
        break
      default:
        break
    }
  })
}

export const updateAppliedRoleStatus = protectedProcedure
  .input(
    z.object({
      appliedRoleId: z.string(),
      applicantId: z.string(),
      status: z.nativeEnum(ApplicationStatus),
      actor: z.nativeEnum(Actor),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { applicantId, appliedRoleId, status, actor } = input
      await updateStatusAndRole(applicantId, status, appliedRoleId, actor)
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
