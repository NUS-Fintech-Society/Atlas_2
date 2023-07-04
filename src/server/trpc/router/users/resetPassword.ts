import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { env } from '~/env/server.mjs'
import { transporter } from '../util/transporter'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'
import { Timestamp, where } from 'firebase/firestore'
import { hash } from 'bcryptjs'

export const resetPassword = publicProcedure
  .input(z.string())
  .mutation(async ({ input: email }) => {
    try {
      const foundUser = await userCollection.queries([
        where('email', '==', email),
      ])

      // Do not tell the user if the account cannot be found for security reasons
      if (!foundUser.length) return

      await userCollection.update(foundUser[0]?.id as string, {
        hashedPassword: await hash(foundUser[0]?.id as string, 10),
      })

      await transporter.sendMail({
        from: env.GMAIL,
        to: email,
        subject: 'Reset Password',
        html: `
            Hi ${foundUser[0]?.name || 'user'},
            <br />
            <p>
              Your password has been reset to your matriculation number.
              You are strongly advised to change your password after 
              logging into your account. Please contact the developer team 
              if you did not make this request.
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
    }
  })
