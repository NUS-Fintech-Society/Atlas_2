import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp } from 'firebase/firestore'
import { adminAuth } from '~/server/db/admin_firebase'
import { TRPCError } from '@trpc/server'
import { transporter } from '../util/transporter'
import { env } from '~/env/server.mjs'

export const resetPassword = publicProcedure
  .input(z.string())
  .mutation(async ({ input: email }) => {
    try {
      const link = await adminAuth.generatePasswordResetLink(email)
      await transporter.sendMail({
        from: env.GMAIL,
        to: email,
        subject: 'Reset Password',
        html: `
            Hi,
            <br />
            <p>
              Please click on the following <a href="${link}">link</a> to change your password.
            </p>
            <br />
            Thank You. <br /> 
            Fintech HR
          `,
      })
    } catch (e) {
      await logCollection.add({
        level: 'WARNING',
        title: 'Error resetting password',
        description: (e as Error).message,
        createdAt: Timestamp.fromDate(new Date()),
      })

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message
      })
    }
  })
