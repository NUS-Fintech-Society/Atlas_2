import { TRPCError } from '@trpc/server'
import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'
import type { User } from '@prisma/client'
import { type PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import userCollection from '~/server/db/collections/UserCollection'

/**
 * Validates whether the user has the necessary permissions
 *
 * @param id The student id of the user
 * @throws {TRPCError} if the user does not have permission
 */
async function checkUserPermission(id: string, prisma: PrismaClient) {
  const personMakingRequest = await prisma.user.findUnique({
    where: { id },
  })

  if (!personMakingRequest || !personMakingRequest.isAdmin) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User is not authorized to create a new account',
    })
  }
}

/**
 * Validates whether the user already exists in the database
 *
 * @param email The email of the user
 * @throws {TRPCError} if the user already exists
 */
async function checkIfUserExist(id: string) {
  const results = await userCollection.findById(id)

  if (results) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'The user already exists',
    })
  }
}

/**
 * Sends an email to the user after the account has been generated.
 *
 * @param email The email of the user to be sent
 * @param password The password of the user
 */
async function sendEmail(email: string, password: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL,
      pass: env.GMAIL_PASSWORD,
    },
  })

  return transporter.sendMail({
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
}

/**
 * Used in create multiple users to generate a users object
 *
 * @param input The input from the frontend
 * @param hashedPassword The hashed password
 * @returns An array of user object to be stored in the database
 */
function buildUserObject(
  input: {
    date_of_birth: string
    diet: string
    department: string
    discord: string
    faculty: string
    gender: string
    linkedin: string
    major: string
    name: string
    nus_email: string
    personal_email: string
    phone: string
    race: string
    role: string
    student_id: string
    telegram: string
    year: string
  }[],
  hashedPassword: string
) {
  return input.map((user) => {
    return {
      batch: 'AY22/23',
      department: user.department,
      date_of_birth: dayjs().toDate(),
      diet: user.diet,
      discord: user.discord,
      faculty: user.faculty,
      gender: user.gender,
      hashedPassword,
      image: null,
      level: 'member',
      linkedin: user.linkedin,
      major: user.major,
      id: user.student_id,
      isAdmin: false,
      name: user.name,
      email: user.nus_email,
      personal_email: user.personal_email,
      phone: user.phone,
      race: user.race,
      role: user.role,
      telegram: user.telegram,
      total_events: 0,
      wallet: null,
      year: user.year,
    }
  })
}

/**
 * Blasts out multiple emails at the same time
 *
 * @param users The array of users object
 * @param password The hashed password
 */
async function sendMultipleEmails(emails: string[], password: string) {
  await Promise.all(
    emails.map(async (email) => await sendEmail(email, password))
  )
}

/**
 * Creates many users in the database
 *
 * @param users The array of users object
 */
async function createManyUsers(users: User[], prisma: PrismaClient) {
  await prisma.user.createMany({
    data: users,
  })
}

export {
  createManyUsers,
  checkUserPermission,
  checkIfUserExist,
  sendEmail,
  sendMultipleEmails,
  buildUserObject,
}
