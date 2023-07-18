import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { sendMultipleEmails } from '../member/helper'
import { db } from '~/server/db/firebase'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp, type Transaction, runTransaction } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'
import { adminAuth } from '~/server/db/admin_firebase'

export async function addUsers(
  input: {
    name: string
    personal_email: string
    department: string
    role: string
    nus_email: string
    student_id: string
    resume?: string | undefined
  }[],
  transaction: Transaction
) {
  /// Step 1: Clean the data by filtering until we have the valid users.
  const users = await userCollection.queries()
  const userIds = new Set(users.map((user) => user.id))
  const userEmails = new Set(users.map((user) => user.email))
  input = input.filter(
    (user) =>
      user.student_id &&
      !userIds.has(user.student_id) &&
      !userEmails.has(user.personal_email)
  )

  /// Step 2: Save the data for all the valid users.
  const emailData = await Promise.all(
    input.map(async (user) => {
      const password = randomUUID().substring(0, 10)

      await adminAuth.createUser({
        email: user.personal_email,
        displayName: user.name,
        uid: user.student_id,
        password,
      })

      userCollection.withTransaction(transaction).set(
        {
          department: user.department,
          email: user.nus_email,
          name: user.name,
          isAdmin: false,
          id: user.student_id,
          role: user.role,
          resume: user.resume || '',
          personal_email: user.personal_email,
        },
        user.student_id
      )

      return {
        email: user.personal_email,
        password,
      }
    })
  )

  await sendMultipleEmails(emailData)
}

export const createManyUsers = protectedProcedure
  .input(
    z.array(
      z.object({
        department: z.string(),
        name: z.string(),
        nus_email: z.string(),
        role: z.string(),
        student_id: z.string(),
        personal_email: z.string(),
        resume: z
          .string()
          .optional()
          .transform((e) => (e === '' ? undefined : e)),
      }) // resume: to aid in applicants creation through csv upload
    )
  )
  .mutation(async ({ input }) => {
    try {
      return await runTransaction(db, (transaction) => addUsers(input, transaction))
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'WARNING',
        description: (e as Error).message,
        title: 'Error while uploading multiple users',
      })
    }
  })
