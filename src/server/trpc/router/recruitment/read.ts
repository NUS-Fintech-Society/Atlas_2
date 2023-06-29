import { TRPCError } from '@trpc/server'
import { limit, orderBy, where } from 'firebase/firestore'
import { z } from 'zod'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'
import userCollection from '~/server/db/collections/UserCollection'
import type { Applicant } from '~/server/db/models/Applicant'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import { protectedProcedure } from '~/server/trpc/trpc'

/**
 * We retrieve applicants based on the logged in Exco's department.
 * The applied role retrieved for the applicant corresponds to the
 * Exco's department and is the highest ranked role that has not been
 * rejected. So each applicant will have one applied role at any
 * point in time, from the perspective of a director.
 * */
export const getAllApplicantsTopRoleByDept = protectedProcedure
  //.input(z.object({
  //   filter: z.string(),
  //   search: z.string()
  // }))
  .query(async ({ ctx }) => {
    try {
      const filtersForUsers = [where('role', '==', 'Applicant')]
      // if (input.search && input.search.length) {
      //   filtersForUsers.push(where('name', '==', input.search))
      // }
      const applicants = await userCollection.queries(filtersForUsers)
      const applicantsWithRoles: Applicant[] = []

      for (let i = 0; i < applicants.length; i++) {
        const applicant = applicants[i]
        if (applicant) {
          const appliedRoles = await appliedRoleCollection.queries([
            where('applicantId', '==', applicant.id),
            where('department', '==', ctx.session.user.department),
            where('status', 'in', [
              ApplicationStatus.ACCEPTED,
              ApplicationStatus.INTERVIEWED,
              ApplicationStatus.OFFERED,
              ApplicationStatus.PENDING,
            ]),
            orderBy('rank'),
            limit(1),
          ])
          // only add applicants that still have roles
          if (appliedRoles.length == 1) {
            applicantsWithRoles.push({
              id: applicant?.id,
              email: applicant?.email,
              name: applicant?.name,
              appliedRoles: appliedRoles,
            })
          }
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

export const getAppliedRoleByRoleId = protectedProcedure
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

export const getAppliedRolesByApplicant = protectedProcedure
  .input(z.string())
  .query(async ({ ctx }) => {
    try {
      return await appliedRoleCollection.queries([
        where('applicantId', '==', ctx.session.user.id),
        orderBy('rank'),
      ])
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error retrieving applied roles for applicants: ' + error,
      })
    }
  })
