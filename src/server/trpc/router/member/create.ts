import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'

import { checkIfUserExist, sendEmail, sendMultipleEmails } from './helper'
import { LogType } from '@prisma/client'
import { ErrorTitle } from '../constants/ErrorTitle'
import userCollection from '~/server/db/collections/UserCollection'
import { type WriteBatch, doc, writeBatch } from 'firebase/firestore'
import { db } from '~/server/db/firebase'
import type { User } from '~/server/db/models/User'

/**
 * Create multiple accounts for many users and send out an
 * email to the people with the random generated password.
 */
export const addMultipleUsers = protectedProcedure
  .input(
    z.array(
      z.object({
        date_of_birth: z.string(),
        diet: z.string(),
        department: z.string(),
        discord: z.string(),
        faculty: z.string(),
        gender: z.string(),
        linkedin: z.string(),
        major: z.string(),
        name: z.string(),
        nus_email: z.string(),
        personal_email: z.string(),
        phone: z.string(),
        race: z.string(),
        role: z.string(),
        student_id: z.string(),
        telegram: z.string(),
        year: z.string(),
      })
    )
  )
  .mutation(async ({ ctx, input }) => {
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
      await ctx.prisma.log.create({
        data: {
          title: ErrorTitle.ERROR_ADDING_MULTIPLE_USERS,
          message: (e as Error).message,
          type: LogType.ERROR,
        },
      })
    }
  })

export const createSingleUser = protectedProcedure
  .input(
    z.object({
      department: z.string(),
      id: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.string(),
      password: z.string(),
      isAdmin: z.boolean(),
    })
  )
  .mutation(async ({ input }) => {
    const { email, id, isAdmin, role, department, name, password } = input

    const [hashedPassword] = await Promise.all([
      hash(password, 10),
      checkIfUserExist(id),
    ])

    await userCollection.set(
      {
        department,
        email,
        isAdmin,
        name,
        hashedPassword,
        role,
      },
      id
    )

    await sendEmail(email, hashedPassword)
  })
