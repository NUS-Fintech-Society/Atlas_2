import { doc, Timestamp, writeBatch } from 'firebase/firestore'
import type { WriteBatch } from 'firebase/firestore'
import { z } from 'zod'
import { db } from '~/server/db/firebase'
import type { AppliedRole } from '~/server/db/models/AppliedRole'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import logCollection from '~/server/db/collections/LogCollection'
import { protectedProcedure } from '../../trpc'
import appliedRoleCollection from '~/server/db/collections/AppliedRoleCollection'

export const createManyAppliedRoles = protectedProcedure
  .input(
    z.array(
      z.object({
        applicantId: z.string(),
        firstRole: z.string(),
        firstDepartment: z.string(),
        secondRole: z.string(),
        secondDepartment: z.string(),
      })
    )
  )
  .mutation(async ({ input }) => {
    try {
      // Add AppliedRole logic
      // Each firebase batch only allow up to 500 writes so we need an array for more than 500 documents
      let batchIndex = 0
      let counter = 0
      const batches: WriteBatch[] = [writeBatch(db)]
      input.forEach((appliedRole) => {
        // first choice
        const appliedRoleOne = {
          applicantId: appliedRole.applicantId,
          rank: 1,
          role: appliedRole.firstRole,
          department: appliedRole.firstDepartment,
          status: ApplicationStatus.PENDING,
          flag: false,
        } as AppliedRole
        batches[batchIndex]?.set(
          doc(db, 'applied_roles', appliedRoleCollection.generateRandomId()),
          appliedRoleOne
        )
        counter += 1

        // create another batch of 500 if reached limit
        if (counter === 499) {
          batches.push(writeBatch(db))
          batchIndex += 1
          counter = 0
        }

        // second choice
        const appliedRoleTwo = {
          applicantId: appliedRole.applicantId,
          rank: 2,
          role: appliedRole.secondRole,
          department: appliedRole.secondDepartment,
          status: ApplicationStatus.PENDING,
          flag: false,
        } as AppliedRole
        batches[batchIndex]?.set(
          doc(db, 'applied_roles', appliedRoleCollection.generateRandomId()),
          appliedRoleTwo
        )
        counter += 1

        // create another batch of 500 if reached limit
        if (counter === 499) {
          batches.push(writeBatch(db))
          batchIndex += 1
          counter = 0
        }
      })
      await Promise.all(batches.map(async (batch) => await batch.commit()))
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'WARNING',
        description: (e as Error).message,
        title: 'Error while creating multiple applied roles',
      })
    }
  })
