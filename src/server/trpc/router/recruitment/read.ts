import { TRPCError } from '@trpc/server'
import { where } from 'firebase/firestore'
import { z } from 'zod'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'
import userCollection from '~/server/db/collections/UserCollection'
import type { Applicant } from '~/server/db/models/Applicant'
import { protectedProcedure } from '~/server/trpc/trpc'

export const getAllApplicants = protectedProcedure.query(async ({}) => {
  try {
    const applicants = await userCollection.queries([
      where('role', '==', 'Applicant'),
    ])
    const applicantsWithRoles: Applicant[] = []

    for (let i = 0; i < applicants.length; i++) {
      const applicant = applicants[i]
      if (applicant) {
        const appliedRoles = await appliedRoleCollection.queries([
          where('applicantId', '==', applicant.id),
        ])
        applicantsWithRoles.push({
          id: applicant?.id,
          name: applicant?.name,
          appliedRoles: appliedRoles,
        })
      }
    }
    return applicantsWithRoles
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error retrieving applicants: ' + error,
    })
  }
})

export const getApplicant = protectedProcedure
  .input(z.string())
  .query(async ({ input }) => {
    try {
      const applicant = await userCollection.getById(input)
      const appliedRoles = await appliedRoleCollection.queries([
        where('applicantId', '==', applicant.id),
      ])
      return {
        id: applicant.id,
        name: applicant.name,
        appliedRoles: appliedRoles,
      }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error retrieving applicants: ' + error,
      })
    }
  })

export const getAppliedRole = protectedProcedure
  .input(z.string())
  .query(async ({ input }) => {
    try {
      return await appliedRoleCollection.getById(input)
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error retrieving applied role: ' + error,
      })
    }
  })
