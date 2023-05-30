import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { checkIfUserExist, sendEmail } from '../member/helper'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp } from 'firebase/firestore'

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
    try {
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
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        description: (e as Error).message,
        title: 'Error creating a single user',
        level: 'WARNING',
      })
    }
  })
