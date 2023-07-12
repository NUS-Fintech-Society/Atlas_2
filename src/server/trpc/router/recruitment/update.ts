import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import { sendOfferEmail, sendRejectionEmail } from './helper'
import userCollection from '~/server/db/collections/UserCollection'
import taskCollection from '~/server/db/collections/TaskCollection'
import { Timestamp, runTransaction, where } from 'firebase/firestore'
import { db } from '~/server/db/firebase'
import type { User } from '~/server/db/models/User'
import type Task from '~/server/db/models/Task'

export const updateAppliedRoleStatus = protectedProcedure
  .input(
    z.object({
      appliedRoleId: z.string(),
      applicantId: z.string(),
      status: z.nativeEnum(ApplicationStatus),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {  
      /// If the user is an admin, he cannot accept the offer for the applicant.
      if (ctx.session.user.id !== input.applicantId) {
        throw Error('An admin user should not be able to accept the offer for the applicant.')
      }

      await runTransaction(db, async (transaction) => {
        /// Get the details for the applied role. We check whether the signed in user
        const [role, applicant] = await Promise.all([
          appliedRoleCollection
            .withTransaction(transaction)
            .get(input.appliedRoleId),
          userCollection
            .withTransaction(transaction)
            .get(input.applicantId)
        ])

        /// Update the applied role with the status.
        appliedRoleCollection.withTransaction(transaction).update({
            status: input.status,
          }, input.appliedRoleId)

        /// If the user accepts his status, we give him the department and role.
        if (input.status === ApplicationStatus.ACCEPTED) {
          const isAdmin =
            role.role === 'Co-Director' ||
            role.role === 'Director' ||
            role.department === 'Internal Affairs'

          const payload: Partial<User> = {
            isAdmin,
            role: role.role,
            department: role.department,
          }

          /// If the user is not admin, we have to give him all the non-expired task and
          /// update the task collection accordingly.
          if (!isAdmin) {
            const pendingTask = await taskCollection.queries([
              where("department", "array-contains", role.department),
              where("due", ">", Timestamp.fromDate(new Date()))
            ])

            payload.pendingTask = pendingTask

            pendingTask.forEach((task) => {
              const taskPayload: Partial<Task> = {}

              if (task.taskCompletion !== undefined) {
                taskPayload.taskCompletion = task.taskCompletion + 1
                taskPayload.status = taskPayload.status === "done" ? null : "done"
              }

              const assignedUser = {
                completed: false,
                department: role.department,
                id: applicant.id,
                name: applicant.name,
                role: role.role
              }

              taskPayload.assignedUsers = task.assignedUsers 
                ? [...task.assignedUsers, assignedUser] 
                : [assignedUser]

              taskCollection.withTransaction(transaction).update(taskPayload, task.id as string)
            })
          }

          userCollection.withTransaction(transaction).update(payload, role.applicantId)
        }
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
      // send email to notify applicants that are offered / rejected
      if (input.status === ApplicationStatus.OFFERED) {
        await sendOfferEmail(
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
