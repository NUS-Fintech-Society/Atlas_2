import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'

import { sendMultipleEmails } from '../util/helper'
import { type WriteBatch, doc, writeBatch } from 'firebase/firestore'
import { db } from '~/server/db/firebase'
import type { User } from '~/server/db/models/User'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp } from 'firebase/firestore'

export const createManyUsers = protectedProcedure
  .input(
    z.array(
      z.object({
        department: z.string(),
        name: z.string(),
        nus_email: z.string(),
        role: z.string(),
        student_id: z.string(),
      })
    )
  )
  .mutation(async ({ input }) => {
    try {
      const password = randomBytes(10).toString('hex')
      const hashedPassword = await hash(password, 10)
      const emails: string[] = []

      // Add user logic. Note that each firebase batch only allow up to 500 writes so we need an array for more than 500 users.
      let batchIndex = 0
      let counter = 0
      const batches: WriteBatch[] = [writeBatch(db)]
      input.forEach((user) => {
        emails.push(user.nus_email)

        batches[batchIndex]?.set(doc(db, 'users', user.student_id), {
          department: user.department,
          email: user.nus_email,
          hashedPassword,
          name: user.name,
          isAdmin: false,
          id: user.student_id,
          role: user.role,
        } as User)

        counter += 1

        if (counter === 499) {
          batches.push(writeBatch(db))
          batchIndex += 1
          counter = 0
        }
      })

      await Promise.all(batches.map(async (batch) => await batch.commit()))
      await sendMultipleEmails(emails, password)
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'WARNING',
        description: (e as Error).message,
        title: 'Error while uploading multiple users',
      })
    }
  })
