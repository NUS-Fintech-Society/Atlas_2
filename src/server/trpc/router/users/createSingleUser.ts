import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { checkIfUserExist, sendNewUserEmail } from '../member/helper'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp, where } from 'firebase/firestore'
import { TRPCError } from '@trpc/server'

export const createSingleUser = protectedProcedure
  .input(
    z.object({
      department: z.string(),
      id: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.string(),
      isAdmin: z.boolean(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { email, id, isAdmin, role, department, name } = input

      const [hashedPassword, isValidEmail] = await Promise.all([
        hash(id, 10),
        userCollection
          .queries([where('email', '==', email)])
          .then((users) => users.length === 0),
        checkIfUserExist(id),
      ])

      // The email should be unique.
      if (!isValidEmail) {
        throw new Error('The email is already in used.')
      }

      await userCollection.set(
        {
          id,
          department,
          email,
          isAdmin,
          name,
          role,
        },
        id
      )

      await sendNewUserEmail(email)
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        description: (e as Error).message,
        title: 'Error creating a single user',
        level: 'WARNING',
      })

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
