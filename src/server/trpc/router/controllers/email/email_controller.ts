import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'

export class EmailController {
  private static transporter = nodemailer.createTransport({
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
  public static async sendEmail(
    recipient: string,
    subject: string,
    body: string,
    cc?: string[]
  ) {
    await this.transporter.sendMail({
      from: env.GMAIL,
      to: recipient,
      cc,
      subject,
      html: body,
    })
  }
}
