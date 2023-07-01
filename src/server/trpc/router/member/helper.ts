import { TRPCError } from '@trpc/server'
import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'
import dayjs from 'dayjs'
import userCollection from '~/server/db/collections/UserCollection'

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
async function sendNewUserEmail(email: string) {
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
    Dear User,
    <br />
    <h1> Welcome to the NUS Fintech Society! </h1>
    <p> Here are a few items to take note of as you get started on your journey with us. </p>

    <h2>1. Collection of details (Compulsory)</h2>
    <p> 
      With effect from August 2023, we will be using the <a href="${env.NEXTAUTH_URL}">ATLAS HRMS</a> 
      portal to disseminate events and tasks. Before proceeding, please log into your account and 
      fill up the form. The password to the account will be your student matriculation number. 
      You are <strong> strongly advised </strong> to change your password after your first login. 
    </p>

    <h2>2. Means of Communication</h2>
    <p>
      We have decided to introduce DISCORD for the upcoming AY!! This is with the aim of fostering a 
      stronger community within our society by establishing avenues for members to better interact with 
      each other. Through our Discord group, you will also receive information regarding internships, 
      hackathons, workshops, giveaways, and a slew of other exciting opportunities! Do, also, look 
      forward to connecting with your fellow society members on Discord and participating in virtual 
      gatherings whether it is a training session or a time to just chill-out.
    </p>
    <p>
    Below are the links to join the respective communication channels. For the Telegram Internal 
    Chat (Private & Informal), you will only be added after submitting your details in the above google 
    form. As for your department channels/groups, your respective director will contact you directly 
    with the invitation links.
    </p>

    Warmest Regards, </br>
    TEO James (Mr.) </br>
    Co-Director (Internal Affairs) | NUS FinTech Society
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
    departmentId: string
    discord: string
    faculty: string
    gender: string
    major: string
    name: string
    nus_email: string
    personal_email: string
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
      departmentId: user.departmentId,
      date_of_birth: dayjs().toDate(),
      discord: user.discord,
      faculty: user.faculty,
      gender: user.gender,
      hashedPassword,
      image: null,
      level: 'member',
      major: user.major,
      id: user.student_id,
      isAdmin: false,
      name: user.name,
      email: user.nus_email,
      personal_email: user.personal_email,
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
async function sendMultipleEmails(emails: string[]) {
  await Promise.all(emails.map(async (email) => await sendNewUserEmail(email)))
}

export {
  checkIfUserExist,
  sendNewUserEmail,
  sendMultipleEmails,
  buildUserObject,
}
