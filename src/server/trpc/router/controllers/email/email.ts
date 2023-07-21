import { env } from '~/env/server.mjs'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL,
    pass: env.GMAIL_PASSWORD,
  },
})

/**
 * @param recipient The recipient's email
 * @param subject In the subject
 * @param body The content of the email in html.
 */
export async function sendEmail(
  recipient: string,
  subject: string,
  body: string,
  cc?: string[]
) {
  await transporter.sendMail({
    from: env.GMAIL,
    to: recipient,
    cc,
    subject,
    html: body,
  })
}
