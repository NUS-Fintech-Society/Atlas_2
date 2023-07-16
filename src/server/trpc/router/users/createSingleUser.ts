import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { sendNewUserEmail } from '../member/helper'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp } from 'firebase/firestore'
import { TRPCError } from '@trpc/server'
import { randomUUID } from 'crypto'
import { adminAuth } from '~/server/db/admin_firebase'

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

      const password = randomUUID().substring(0, 10)
      const hashedPassword = await hash(password, 10)
      await adminAuth.createUser({
        displayName: name,
        email,
        password: hashedPassword,
        uid: id,
      })

      await userCollection.set({
          id,
          department,
          email,
          isAdmin,
          name,
          role,
      }, id)

      await sendNewUserEmail(email, password)
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
