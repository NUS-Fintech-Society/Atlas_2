import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'
import type { User } from '@prisma/client'

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
      const password = randomBytes(8).toString('hex')
      const hashedPassword = await hash(password, 10)

      const users: User[] = input.map((user) => {
        return {
          attendance: 0,
          batch: 'AY22/23',
          department: user.department,
          date_of_birth: dayjs().toDate(),
          diet: user.diet,
          discord: user.discord,
          faculty: user.faculty,
          gender: user.gender,
          hashedPassword,
          hobbies: user.hobbies,
          image: null,
          level: 'member',
          linkedin: user.linkedin,
          major: user.major,
          id: user.student_id,
          name: user.name,
          email: user.nus_email,
          personal_email: user.personal_email,
          phone: user.phone,
          race: user.race,
          roles: user.roles,
          shirt: user.shirt,
          telegram: user.telegram,
          total_events: 0,
          wallet: null,
          year: user.year,
          eventId: null,
        }
      })

      users.forEach(async (user) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: env.GMAIL,
            pass: env.GMAIL_PASSWORD,
          },
        })

        await transporter.sendMail({
          from: env.GMAIL,
          to: user.email,
          subject: 'New Account Creation',
          html: `
            Hi User,
            <br />
            <p> We welcome you to Fintech Society. We hope you enjoy your
            time here. In order to get you onboard, please login with 
            the following password and change it immediately. </p>
            <br />
            <a href="${env.NEXTAUTH_URL}">HRMS Website</a>
            <br />
            The password is <strong>${password}</strong>
            <br />
            Thank You. <br /> 
            Fintech HR
            `,
        })
      })

      await ctx.prisma.user.createMany({
        data: users,
      })
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
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
    })
  )
  .mutation(async ({ ctx, input }) => {
    const personMakingRequest = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    })

    // If the user is just a normal member, he should not be able to create a new account
    if (!personMakingRequest || personMakingRequest.level === 'member') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User is not authorized to create a new account',
      })
    }

    const { email, id, level } = input

    try {
      const password = input.password || randomBytes(10).toString('hex')

      const hashedPassword = await hash(password, 10)

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
        subject: 'New Account Creation',
        html: `
      Hi User,
      <br />
      <p> We welcome you to Fintech Society. We hope you enjoy your
      time here. In order to get you onboard, please login with 
      the following password and change it immediately. </p>
      <br />
      <a href="${env.NEXTAUTH_URL}">HRMS Website</a>
      <br />
      The password is <strong>${password}</strong>
      <br />
      Thank You. <br /> 
      Fintech HR
      `,
      })

      const foundUser = await ctx.prisma.user.findUnique({ where: { email } })
      if (foundUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        })
      }

      await ctx.prisma.user.create({
        data: {
          batch: 'AY2022/2023',
          name: '',
          roles: '',
          email,
          id,
          hashedPassword,
          level,
        },
      })
    } catch (e) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: (e as Error).message,
      })
    }
  })
