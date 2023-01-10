import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'

export const resetPassword = publicProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    try {
      const email = input
      const foundUser = await ctx.prisma.user.findFirst({
        where: {
          email,
        },
      })

      // Do not tell the user if the account cannot be found for security reasons
      if (!foundUser) return

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.GMAIL,
          pass: env.GMAIL_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: env.GMAIL,
        to: email,
        subject: 'Reset Password',
        html: `
            Hi ${foundUser.name || 'user'},
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
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
