import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'
import type { User } from '@prisma/client'
import {
  checkIfUserExist,
  createNewUser,
  sendEmail,
  sendMultipleEmails,
  buildUserObject,
  createManyUsers,
} from './helper'
import { LogType } from '@prisma/client'

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
        hobbies: z.string(),
        linkedin: z.string(),
        major: z.string(),
        name: z.string(),
        nus_email: z.string(),
        personal_email: z.string(),
        phone: z.string(),
        race: z.string(),
        roles: z.string(),
        shirt: z.string(),
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

      const users: User[] = buildUserObject(input, hashedPassword)
      await createManyUsers(users)
      await sendMultipleEmails(users, password)
    } catch (e) {
      await ctx.prisma.log.create({
        data: {
          title: 'Error: Add Multiple Users',
          message: (e as Error).message,
          type: LogType.ERROR,
        },
      })
    }
  })

export const createSingleUser = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      email: z.string(),
      password: z.optional(z.string()),
      level: z.string(),
      isAdmin: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { email, id, level, isAdmin } = input
      const password = input.password || randomBytes(10).toString('hex')

      await checkIfUserExist(email)
      await createNewUser(email, id, isAdmin, level, password)
      await sendEmail(email, password)
    } catch (e) {
      await ctx.prisma.log.create({
        data: {
          title: 'Error: Add Single Users',
          message: (e as Error).message,
          type: LogType.ERROR,
        },
      })
    }
  })
  