import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import { sendAcceptanceEmail, sendRejectionEmail } from './helper'

export const updateAppliedRoleStatus = protectedProcedure
  .input(
    z.object({
      appliedRoleId: z.string(),
      status: z.nativeEnum(ApplicationStatus),
    })
  )
  .mutation(async ({ input }) => {
    try {
      await appliedRoleCollection.update(input.appliedRoleId, {
        status: input.status,
      })
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })

export const updateAppliedRoleStatusWithEmail = protectedProcedure
  .input(
    z.object({
      appliedRoleId: z.string(),
      status: z.nativeEnum(ApplicationStatus),
      name: z.string(),
      email: z.string(),
      appliedRole: z.string(),
      appliedDepartment: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      await appliedRoleCollection.update(input.appliedRoleId, {
        status: input.status,
      })
      // send email to notify applicants that are accepted / rejected
      if (input.status === ApplicationStatus.ACCEPTED) {
        await sendAcceptanceEmail(
          input.email,
          input.name,
          input.appliedRole,
          input.appliedDepartment
        )
      } else if (input.status === ApplicationStatus.REJECTED) {
        await sendRejectionEmail(
          input.email,
          input.name,
          input.appliedRole,
          input.appliedDepartment
        )
      }
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
