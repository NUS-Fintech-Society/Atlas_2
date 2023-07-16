import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'

import { sendMultipleEmails } from '../member/helper'
import { type WriteBatch, doc, writeBatch } from 'firebase/firestore'
import { db } from '~/server/db/firebase'
import type { User } from '~/server/db/models/User'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp, runTransaction } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'

export const createManyUsers = protectedProcedure
  .input(
    z.array(
      z.object({
        department: z.string(),
        name: z.string(),
        nus_email: z.string(),
        role: z.string(),
        student_id: z.string(),
        resume: z
          .string()
          .optional()
          .transform((e) => (e === '' ? undefined : e)),
      }) // resume: to aid in applicants creation through csv upload
    )
  )
  .mutation(async ({ input }) => {
    try {
      /// Filter out all the empty rows.
      input = input.filter(user => user.student_id)

      return await runTransaction(db, async (transaction) => {
        await Promise.all(input.map(async (user) => {
          const hashedPassword = await hash(user.student_id, 10)

          userCollection.withTransaction(transaction).set({
            department: user.department,
            email: user.nus_email,
            hashedPassword,
            name: user.name,
            isAdmin: false,
            id: user.student_id,
            role: user.role,
            resume: user.resume || "",
          }, user.student_id)
        }))

        await sendMultipleEmails(input.map(user => user.nus_email))
      })
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'WARNING',
        description: (e as Error).message,
        title: 'Error while uploading multiple users',
      })
    }
  })
