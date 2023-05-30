import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL,
    pass: env.GMAIL_PASSWORD,
  },
})
