import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { env } from '~/env/server.mjs'
import { transporter } from '../util/transporter'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp } from 'firebase/firestore'

export const resetPassword = publicProcedure
  .input(z.string())
  .mutation(async ({ input: email }) => {
    try {
      const foundUser = await userCollection.queries([
        {
          type: 'where',
          fieldPath: 'email',
          direction: '==',
          value: email,
        },
      ])

      // Do not tell the user if the account cannot be found for security reasons
      if (!foundUser.length) return

      await transporter.sendMail({
        from: env.GMAIL,
        to: email,
        subject: 'Reset Password',
        html: `
            Hi ${foundUser[0]?.name || 'user'},
            <br />
            <p>A request to reset your account's password has been made. 
            If you did not make this request, please ignore the email.
            Otherwise, click on the link below to reset the password.</p>
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
    }
  })
